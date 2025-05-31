import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { laptopRoutes } from "./routes/laptop";
import { propertyRoutes } from "./routes/property";

const app = new Elysia({ prefix: "/api/v1" })
	.use(cors())
	.use(
		swagger({
			documentation: {
				tags: [
					{ description: "CRUD для ноутбуков", name: "laptops" },
					{ description: "CRUD для свойств", name: "properties" },
				],
			},
			path: "/docs",
		})
	)
	.use(laptopRoutes)
	.use(propertyRoutes)
	.listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`);
