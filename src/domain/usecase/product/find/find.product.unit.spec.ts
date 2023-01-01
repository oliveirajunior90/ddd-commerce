import Product from "../../../product/entity/product";
import FindProductUseCase from "./find.product.usecase";


const product = new Product("123", "Iphone 14", 8500);

const MockRepository = () => ({
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
    findAll: jest.fn(),
});


describe("Test find product use case", () => {

    it("should find a product", async () => {

        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        }

        const result = await usecase.execute(input);

        expect(result).toEqual({
            id: "123",
            name: "Iphone 14",
            price: 8500
        });

    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
          throw new Error("product not found");
        });
        const usecase = new FindProductUseCase(productRepository);
    
        const input = {
          id: "123",
        };
    
        expect(() => {
          return usecase.execute(input);
        }).rejects.toThrow("product not found");
      });

});