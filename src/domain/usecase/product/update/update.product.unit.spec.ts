import ProductFactory from "../../../product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product1 = ProductFactory.create(
    "a",
    "Xiaomi Pocophone X4 Pro",
    2300
  );

const product2 = ProductFactory.create(
  "a",
  "Iphone 14",
  7500
);

const input = {
  id: product2.id,
  name: "Iphone15",
  price: 10000,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product2)),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
  
    const result = await productUpdateUseCase.execute(input);
  
    expect(result).toEqual(input);
  });
});