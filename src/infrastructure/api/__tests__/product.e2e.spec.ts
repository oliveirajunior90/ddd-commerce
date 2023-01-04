import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Iphone 14",
      price: 7500,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Iphone 14");
    expect(response.body.price).toBe(7500);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "iphone 15",
    });
    expect(response.status).toBe(500);
  });

  it("should find a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Iphone 14",
      price: 7500,
    });
    const productId = response.body.id;
    const response2 = await request(app).get(`/product/${productId}`);

    expect(response2.body.name).toBe("Iphone 14");
    expect(response2.body.price).toBe(7500);
  });

  it("shouldn't find a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Iphone 14",
      price: 7500,
    });
    const productId = response.body.id;
    const response2 = await request(app).get(`/product/${productId}`);

    expect(response2.body.name).not.toBe("Iphone 17");
    expect(response2.body.price).not.toBe(9500);
  });

  it("should list all product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Iphone 14",
      price: 7500,
    });
    expect(response.status).toBe(200);
    const response2 = await request(app).post("/product").send({
      type: "a",
      name: "Xiaomi Poco X4 pro",
      price: 2500,
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Iphone 14");
    expect(product.price).toBe(7500);

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Xiaomi Poco X4 pro");
    expect(product2.price).toBe(2500);
  });
});
