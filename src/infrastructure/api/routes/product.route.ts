import express, { Request, Response } from "express";
import CreateProductUseCase from "../../../domain/usecase/product/create/create.product.usecase";
import ListProductUseCase from "../../../domain/usecase/product/list/list.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import FindProductUseCase from "../../../domain/usecase/product/find/find.product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new CreateProductUseCase(new ProductRepository());
  try {
    const productDto = {
      type: req.body.type,
      name: req.body.name,
      price: req.body.price,
    };
    const output = await usecase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

productRoute.get("/:id", async (req: Request, res: Response) => {
  const usecase = new FindProductUseCase(new ProductRepository());
  const output = await usecase.execute({
    id: req.params.id,
  });

  res.format({
    json: async () => res.send(output),
  });
});

productRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());
  const output = await usecase.execute();

  res.format({
    json: async () => res.send(output),
  });
});
