import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  let customerRepository;
  let customer: Customer;
  let address: Address;

  let productRepository;
  let product: Product;

  let order: Order;
  let orderItem: OrderItem;
  
  let orderRepository : OrderRepository;
    
  beforeEach(async () => {

    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    customerRepository = new CustomerRepository();
    customer = new Customer("123", "Customer 1");
    address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    product = new Product("123", "Product 1", 10);

    productRepository = new ProductRepository();
    await productRepository.create(product);

    orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    orderRepository = new OrderRepository();
    order = new Order("123", "123", [orderItem]);
   
    orderRepository.create(order);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.unitPrice,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async() => {

    const product2 = new Product("12367", "Iphone", 7000);

    const productRepository2 = new ProductRepository();
    await productRepository2.create(product2);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    order.changeOrderItems([orderItem, orderItem2]);
    
    await orderRepository.update(order)
    
    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.unitPrice,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.unitPrice,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "12367",
        },
      ],
    })

  })

  it("should find an order", async() => {

    const resultRepository = await orderRepository.find("123");
   
    const resultModel = await OrderModel.findOne({ where: { id: "123" }, include: ["items"]});

    expect(resultModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: resultRepository.items[0].id,
          name: resultRepository.items[0].name,
          price: resultRepository.items[0].unitPrice,
          quantity: resultRepository.items[0].quantity,
          order_id: "123",
          product_id: "123",
        }
      ]
    });
  })

  it("should find all orders", async() => {
    const resultRepository = await orderRepository.findAll();
    const resultModel = await OrderModel.findAll({
      include: [{model: OrderItemModel}]
    });

    const orders = [order];
    expect(orders).toStrictEqual(resultRepository)

  })
});
