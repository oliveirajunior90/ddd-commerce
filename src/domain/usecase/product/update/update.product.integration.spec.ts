import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";
import ProductRepository from "../../../../infrastructure/product/repository/sequelize/product.repository";

describe("Test find product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should find a product", async () => {

        const productRepository = new ProductRepository();
        const updateProductUsecase = new UpdateProductUseCase(productRepository);
        const findProductUsecase = new FindProductUseCase(productRepository);

        const product1 = new Product("123", "Iphone 14", 8500);
        const product2 = new Product("1235", "Xiaomi note 12 pro", 2500);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const inputUpdate = {
            id: "123",
            name: "Iphone15",
            price: 10000
        }

        const input = {
          id:"123",
        }

    
        await updateProductUsecase.execute(inputUpdate);

        const result = await findProductUsecase.execute(input);

        expect(result).toEqual(inputUpdate);
    });
});