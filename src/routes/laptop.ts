import { and, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia, NotFoundError, t } from "elysia";

import { db } from "../database/db";
import { laptopsTable } from "../database/schema/laptops";
import { laptopsToPropertiesTable } from "../database/schema/laptopsToProperties";
import { propertiesTable } from "../database/schema/properties";
import { unpackLaptop } from "./helpers";

const laptopReadSchemaRaw = createSelectSchema(laptopsTable);
const laptopReadSchema = t.Intersect([
	laptopReadSchemaRaw,
	t.Object({
		properties: t.Record(t.String(), t.Union([t.String(), t.Number(), t.Boolean()])),
	}),
]);
const laptopCreateSchema = t.Object({
	brand: t.String({ minLength: 1 }),
	model: t.String({ minLength: 1 }),
	name: t.String({ minLength: 1 }),
});

const laptopUpdateSchema = t.Record(
	t.String(),
	t.Union([t.String(), t.Number(), t.Boolean(), t.Null(), t.Undefined()])
);

const initialColumnsIndexes: Record<string, number> = {
	brand: 11,
	model: 10,
	name: 9,
};

export const laptopRoutes = new Elysia({ prefix: "/laptops", tags: ["laptops"] })
	.get(
		"/",
		async () => {
			const rows = await db.query.laptopsTable.findMany({
				with: {
					laptopsToProperties: {
						with: { property: true },
					},
				},
			});

			return rows.map(unpackLaptop);
		},

		{ detail: { description: "Получение всех ноутбуков" }, response: { 200: t.Array(laptopReadSchema) } }
	)

	.get(
		"/:id",
		async ({ params }) => {
			const row = await db.query.laptopsTable.findFirst({
				where: eq(laptopsTable.id, params.id),
				with: {
					laptopsToProperties: { with: { property: true } },
				},
			});

			if (!row) {
				throw new NotFoundError(`No laptop with id=${params.id}`);
			}

			return unpackLaptop(row);
		},
		{
			detail: { description: "Получение ноутбука по id" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: laptopReadSchema, 404: t.String() },
		}
	)

	.post(
		"/",
		({ body }) => {
			return db.transaction(async tx => {
				const [laptop] = await tx.insert(laptopsTable).values({}).returning();
				await tx.insert(laptopsToPropertiesTable).values(
					Object.entries(body).map(([key, value]) => ({
						laptopId: laptop.id,
						propertyId: initialColumnsIndexes[key],
						value,
					}))
				);
				const row = await tx.query.laptopsTable.findFirst({
					where: eq(laptopsTable.id, laptop.id),
					with: {
						laptopsToProperties: {
							with: {
								property: true,
							},
						},
					},
				});

				if (!row) {
					throw new Error("Failed to create laptop");
				}

				return unpackLaptop(row);
			});
		},
		{ body: laptopCreateSchema, detail: { description: "Создание ноутбука" }, response: { 200: laptopReadSchema } }
	)

	.patch(
		"/:id",
		({ body, params }) => {
			return db.transaction(async tx => {
				for (const propertyName in body) {
					const property = await tx.query.propertiesTable.findFirst({
						where: eq(propertiesTable.name, propertyName),
					});

					if (!property) {
						throw new NotFoundError(`No property with name=${propertyName}`);
					}

					if (body[propertyName] === undefined) {
						continue;
					}

					if (body[propertyName] === null) {
						await tx
							.delete(laptopsToPropertiesTable)
							.where(
								and(
									eq(laptopsToPropertiesTable.laptopId, params.id),
									eq(laptopsToPropertiesTable.propertyId, property.id)
								)
							);
					} else {
						await tx
							.insert(laptopsToPropertiesTable)
							.values({
								laptopId: params.id,
								propertyId: property.id,
								value: body[propertyName].toString(),
							})
							.onConflictDoUpdate({
								set: {
									value: body[propertyName].toString(),
								},
								target: [laptopsToPropertiesTable.laptopId, laptopsToPropertiesTable.propertyId],
							});
					}
				}

				const row = await tx.query.laptopsTable.findFirst({
					where: eq(laptopsTable.id, params.id),
					with: { laptopsToProperties: { with: { property: true } } },
				});

				if (!row) {
					throw new Error("Failed to update laptop");
				}

				return unpackLaptop(row);
			});
		},
		{
			body: laptopUpdateSchema,
			detail: { description: "Обновление ноутбука" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: laptopReadSchema },
		}
	)

	.delete(
		"/:id",
		async ({ params }) => {
			return db
				.delete(laptopsTable)
				.where(eq(laptopsTable.id, params.id))
				.returning()
				.then(rows => rows[0]);
		},
		{
			detail: { description: "Удаление ноутбука" },
			params: t.Object({ id: t.Numeric() }),
			response: { 200: laptopReadSchemaRaw },
		}
	);
