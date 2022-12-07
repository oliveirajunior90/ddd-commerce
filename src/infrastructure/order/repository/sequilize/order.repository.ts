import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.unitPrice,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    )
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.unitPrice,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      
      await OrderItemModel.bulkCreate(items, { transaction: t })

      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }
  
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ 
      where: { id }, 
      include: ["items"]
    });

    const items = await orderModel.items.map((orderItem: OrderItemModel) => {
      return new OrderItem(orderItem.id,  orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity);
    })

   return new Order(orderModel.id, orderModel.customer_id, items);
  
  };
  
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{model: OrderItemModel}]
    });
    
    return orderModels.map((order : OrderModel) => {

      const items : OrderItem[] = order.items.map((orderItem : OrderItemModel) => 
        new OrderItem(orderItem.id,  orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity));

      return new Order(order.id, order.customer_id, items);  
      
    })
  }

}
