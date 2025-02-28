import { DataSource } from "typeorm";
import appDataSource from "../../data-source";
import initialSetup from "../../utils/initialSetup";
import request from "supertest";
import app from "../../app";

describe("testing route /products", () => {
  let connection: DataSource;

  const user = {
    email: "master@master.com",
    password: process.env.MASTERUSER_PASSWORD,
  };

  const productTest = {
    name: "Celular Kenzie",
    description: "Um celular para estudos da kenzie",
  };

  beforeAll(async () => {
    await appDataSource
      .initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during dataSource initialization", err);
      });
    await initialSetup();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Should be able to update inventory", async () => {
    const responseLogin = await request(app).post("/login").send(user);
    const token = "Bearer " + responseLogin.body.token;

    const responseCreatePermission = await request(app)
      .post("/permissions")
      .set("Authorization", token)
      .send({ name: "permissionTest" });

    const permissionId = responseCreatePermission.body.newPermission.id;

    const category = {
      name: "eletronico",
    };
    const responseCreateCategory = await request(app)
      .post("/categories")
      .set("Authorization", token)
      .send(category);

    const categoryId = responseCreateCategory.body.id;

    const responseCreateProduct = await request(app)
      .post("/products")
      .set("Authorization", token)
      .send({ ...productTest, category_id: categoryId });

    const productId = responseCreateProduct.body.newProduct.id;

    const inventory = {
      product_id: productId,
      total_value: 10,
      quantity: 10,
    };

    const response = await request(app)
      .post("/inventory")
      .set("Authorization", token)
      .send({ ...inventory });

    const inventoryId = response.body.newProduct.id;
    const responseUpdate = await request(app)
      .patch(`/inventory/${inventoryId}`)
      .set("Authorization", token)
      .send({ quantity: 20 });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
  });

  test("Should throw an error when send a wrong id", async () => {
    const responseLogin = await request(app).post("/login").send(user);

    const token = "Bearer " + responseLogin.body.token;

    const response = await request(app)
      .patch("/inventory/123456}")
      .set("Authorization", token)
      .send({ name: "updateTestUser" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
