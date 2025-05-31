import { relations, sql } from "drizzle-orm";
import { check, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

import { timestamps } from "../helpers";
import { laptopsToPropertiesTable } from "./laptopsToProperties";

export const propertyTypeEnum = pgEnum("property_type", ["string", "number", "boolean", "enum"]);

export const propertiesTable = pgTable(
	"properties",
	{
		enumValues: text("enum_values").array(),
		id: serial("id").primaryKey(),
		name: text("name").notNull().unique(),
		type: propertyTypeEnum("type").notNull(),
		...timestamps,
	},
	() => [
		check("enum_values_check", sql`type != 'enum' OR (type = 'enum' AND array_length(enum_values, 1) > 0)`),
		check("name_not_empty", sql`length(trim(name)) > 0`),
	]
);

export const propertiesRelations = relations(propertiesTable, ({ many }) => ({
	laptopsToProperties: many(laptopsToPropertiesTable),
}));
