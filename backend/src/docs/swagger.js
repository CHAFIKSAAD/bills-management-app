const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Bills Management API",
    version: "1.0.0",
    description:
      "API documentation for Bills Management App: authentication, clients, categories, products, invoices, payments and dashboard.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "saad@test.com" },
          password: { type: "string", example: "123456" },
        },
      },
      RegisterRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Saad" },
          email: { type: "string", example: "saad@test.com" },
          password: { type: "string", example: "123456" },
        },
      },
      Client: {
        type: "object",
        properties: {
          name: { type: "string", example: "Client Test" },
          email: { type: "string", example: "client@test.com" },
          phone: { type: "string", example: "0600000000" },
          address: { type: "string", example: "Casablanca" },
        },
      },
      Category: {
        type: "object",
        properties: {
          name: { type: "string", example: "Informatique & Réseaux" },
        },
      },
      Product: {
        type: "object",
        properties: {
          name: { type: "string", example: "Souris Logitech M185" },
          description: { type: "string", example: "Souris sans fil Logitech" },
          price: { type: "number", example: 180 },
          stock: { type: "number", example: 25 },
          categoryId: { type: "number", example: 1 },
        },
      },
      Invoice: {
        type: "object",
        properties: {
          clientId: { type: "number", example: 1 },
          tvaRate: { type: "number", example: 20 },
          discount: { type: "number", example: 0 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "number", example: 1 },
                quantity: { type: "number", example: 2 },
              },
            },
          },
        },
      },
      Payment: {
        type: "object",
        properties: {
          invoiceId: { type: "number", example: 1 },
          amount: { type: "number", example: 5000 },
          method: {
            type: "string",
            example: "CASH",
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "API health check",
        tags: ["General"],
        responses: {
          200: {
            description: "API is running",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: { description: "User created successfully" },
          400: { description: "Validation error" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful with JWT token" },
          400: { description: "Invalid email or password" },
        },
      },
    },

    "/api/auth/me": {
      get: {
        summary: "Get authenticated user",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Authenticated user information" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/api/clients": {
      get: {
        summary: "Get all clients",
        tags: ["Clients"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of clients" },
        },
      },
      post: {
        summary: "Create client",
        tags: ["Clients"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Client",
              },
            },
          },
        },
        responses: {
          201: { description: "Client created successfully" },
        },
      },
    },

    "/api/clients/{id}": {
      put: {
        summary: "Update client",
        tags: ["Clients"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Client",
              },
            },
          },
        },
        responses: {
          200: { description: "Client updated successfully" },
        },
      },
      delete: {
        summary: "Delete client",
        tags: ["Clients"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Client deleted successfully" },
        },
      },
    },

    "/api/categories": {
      get: {
        summary: "Get all categories",
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of categories" },
        },
      },
      post: {
        summary: "Create category",
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        responses: {
          201: { description: "Category created successfully" },
        },
      },
    },

    "/api/categories/{id}": {
      put: {
        summary: "Update category",
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        responses: {
          200: { description: "Category updated successfully" },
        },
      },
      delete: {
        summary: "Delete category",
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Category deleted successfully" },
        },
      },
    },

    "/api/products": {
      get: {
        summary: "Get all products",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of products" },
        },
      },
      post: {
        summary: "Create product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          201: { description: "Product created successfully" },
        },
      },
    },

    "/api/products/{id}": {
      put: {
        summary: "Update product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        responses: {
          200: { description: "Product updated successfully" },
        },
      },
      delete: {
        summary: "Delete product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Product deleted successfully" },
        },
      },
    },

    "/api/invoices": {
      get: {
        summary: "Get all invoices",
        tags: ["Invoices"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of invoices" },
        },
      },
      post: {
        summary: "Create invoice",
        tags: ["Invoices"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Invoice",
              },
            },
          },
        },
        responses: {
          201: { description: "Invoice created successfully" },
        },
      },
    },

    "/api/invoices/{id}": {
      get: {
        summary: "Get invoice details",
        tags: ["Invoices"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Invoice details" },
        },
      },
      delete: {
        summary: "Delete invoice",
        tags: ["Invoices"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Invoice deleted successfully" },
        },
      },
    },

    "/api/payments": {
      get: {
        summary: "Get all payments",
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of payments" },
        },
      },
      post: {
        summary: "Create payment",
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        responses: {
          201: { description: "Payment created successfully" },
        },
      },
    },

    "/api/payments/invoice/{invoiceId}": {
      get: {
        summary: "Get payments by invoice",
        tags: ["Payments"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Payments of an invoice" },
        },
      },
    },

    "/api/dashboard": {
      get: {
        summary: "Get dashboard statistics",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Dashboard statistics" },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
