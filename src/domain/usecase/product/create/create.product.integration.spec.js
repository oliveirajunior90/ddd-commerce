import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../product/entity/product";
import createProductUseCase from "./create.product.usecase";
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new createProductUseCase(productRepository);

    const product = new Product("a", "123", "Iphone 14", 8500);

    const input = {
      type: "a",
      name: product.name,
      price: product.price,
    };

    const result = await usecase.execute(input);

    const output = {
      id: result.id,
      name: result.name,
      price: result.price,
    };

    expect(result).toEqual(output);
  });
});
