import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { apiKeyMiddleware } from "./middlewares/apiKey";
import { laptopRoutes } from "./routes/laptop";
import { propertyRoutes } from "./routes/property";

const app = new Elysia()
	.use(
		cors({
			allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
			credentials: true,
			maxAge: 86_400,
			methods: ["GET", "POST", "PATCH", "DELETE"],
			origin: true, // Разрешаем только same-origin запросы
		})
	)
	.use(
		swagger({
			documentation: {
				components: {
					securitySchemes: {
						apiKey: {
							description: "API ключ для аутентификации",
							in: "header",
							name: "x-api-key",
							type: "apiKey",
						},
					},
				},
				info: {
					description: "API для управления ноутбуками и их свойствами",
					title: "PropsLaptops API",
					version: process.env.IMAGE_TAG || "dev",
				},
				security: [{ apiKey: [] }],
				tags: [
					{ description: "CRUD для ноутбуков", name: "laptops" },
					{ description: "CRUD для свойств", name: "properties" },
				],
			},
			path: "/api/v1/docs",
		})
	)
	.use(apiKeyMiddleware)
	.group("/api/v1", app => app.use(laptopRoutes).use(propertyRoutes))
	.onRequest(({ set }) => {
		// Добавляем заголовки безопасности
		set.headers["X-Content-Type-Options"] = "nosniff";
		set.headers["X-Frame-Options"] = "DENY";
		set.headers["X-XSS-Protection"] = "1; mode=block";
		set.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
		set.headers["Content-Security-Policy"] = "default-src 'self'";
	})
	.listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/docs`);
