import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { laptopRoutes } from "./routes/laptop";
import { propertyRoutes } from "./routes/property";

const app = new Elysia()
	.use(cors())
	.use(
		swagger({
			documentation: {
				info: {
					description: "API для управления ноутбуками и их свойствами",
					title: "PropsLaptops API",
					version: process.env.IMAGE_TAG || "dev",
				},
				tags: [
					{ description: "CRUD для ноутбуков", name: "laptops" },
					{ description: "CRUD для свойств", name: "properties" },
				],
			},
			path: "/api/v1/docs",
		})
	)
	.group("/api/v1", app => app.use(laptopRoutes).use(propertyRoutes))
	.listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api/v1/docs`);
