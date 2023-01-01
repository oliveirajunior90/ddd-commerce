import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../product/entity/product";
import ListProductUseCase from "./list.product.usecase";
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
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("123", "Iphone 14", 8500);
        const product2 = new Product("1235", "Xiaomi note 12 pro", 2500);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const output = {
            "products":[
                {
                    id: product1.id,
                    name: product1.name,
                    price: product1.price,
                },
                {
                    id: product2.id,
                    name: product2.name,
                    price: product2.price,
                }
            ]
        }

        const result = await usecase.execute();
        
        expect(result).toEqual(output);
    });
});