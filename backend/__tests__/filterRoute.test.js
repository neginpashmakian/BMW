const request = require("supertest");
const app = require("../server");

jest.setTimeout(15000); // in case DB takes time

describe("POST /data/filter", () => {
  it("should return filtered data when 'Brand' contains 'Tesla'", async () => {
    const response = await request(app).post("/data/filter").send({
      field: "Brand",
      operator: "contains",
      value: "Tesla",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((item) => {
      expect(item.Brand).toMatch(/Tesla/i);
    });
  });

  it("should return no results for unknown value", async () => {
    const response = await request(app).post("/data/filter").send({
      field: "Brand",
      operator: "contains",
      value: "ThisBrandDoesNotExist",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it("should return an error for missing field", async () => {
    const response = await request(app).post("/data/filter").send({
      operator: "contains",
      value: "Tesla",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return an error for invalid operator", async () => {
    const response = await request(app).post("/data/filter").send({
      field: "Brand",
      operator: "invalidOperator",
      value: "Tesla",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return exact match if operator is 'equals'", async () => {
    const response = await request(app).post("/data/filter").send({
      field: "Brand",
      operator: "equals",
      value: "Tesla",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((item) => {
      expect(item.Brand).toBe("Tesla");
    });
  });
});
