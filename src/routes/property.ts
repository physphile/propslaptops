import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { Elysia, NotFoundError, t } from "elysia";

import { db } from "../database/db";
import { propertiesTable } from "../database/schema/properties";
import { PropertyTypeSchema } from "./shemas";

const propertyCreateSchemaRaw = createInsertSchema(propertiesTable, {
	type: PropertyTypeSchema,
});
const propertyCreateSchema = t.Pick(propertyCreateSchemaRaw, ["name", "type", "enumValues"]);

const propertyReadSchema = createSelectSchema(propertiesTable, { type: PropertyTypeSchema });

const propertyUpdateSchemaRaw = createUpdateSchema(propertiesTable, { type: t.Optional(PropertyTypeSchema) });
const propertyUpdateSchema = t.Pick(propertyUpdateSchemaRaw, ["name", "type", "enumValues"]);

export const propertyRoutes = new Elysia({ prefix: "/properties", tags: ["properties"] })
	.get(
		"/",
		() => {
			return db.query.propertiesTable.findMany();
		},
		{ detail: { description: "Получение всех свойств" }, response: { 200: t.Array(propertyReadSchema) } }
	)

	.get(
		"/:id",
		async ({ params }) => {
			const row = await db.query.propertiesTable.findFirst({
				where: eq(propertiesTable.id, params.id),
			});
			if (!row) {
				throw new NotFoundError(`No property with id=${params.id}`);
			}
			return row;
		},
		{
			detail: { description: "Получение свойства по id" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: propertyReadSchema, 404: t.String() },
		}
	)

	.post(
		"/",
		({ body }) => {
			return db
				.insert(propertiesTable)
				.values(body)
				.returning()
				.then(rows => rows[0]);
		},
		{
			body: propertyCreateSchema,
			detail: { description: "Создание нового свойства" },
			response: { 200: propertyReadSchema },
		}
	)

	.patch(
		"/:id",
		({ body, params }) => {
			return db.transaction(async tx => {
				await tx.update(propertiesTable).set(body).where(eq(propertiesTable.id, params.id));

				const row = await tx.query.propertiesTable.findFirst({
					where: eq(propertiesTable.id, params.id),
				});

				if (!row) {
					throw new NotFoundError(`No property with id=${params.id}`);
				}

				return row;
			});
		},
		{
			body: propertyUpdateSchema,
			detail: { description: "Обновление свойства по id" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: propertyReadSchema },
		}
	)

	.delete(
		"/:id",
		({ params }) => {
			return db
				.delete(propertiesTable)
				.where(eq(propertiesTable.id, params.id))
				.returning()
				.then(rows => rows[0]);
		},
		{
			detail: { description: "Удаление свойства по id" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: propertyReadSchema },
		}
	);
