import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

const input : InputCreateProductDto = {
    type: 'a',
    name: "Iphone 13",
    price: 7000.00
  };

const MockRepository = () => {
    return {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
  };

describe("Unit test create product use case", () => {

    it("should create a product", async () => {

        const productRepository = MockRepository();
    
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const output = await productCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });
})