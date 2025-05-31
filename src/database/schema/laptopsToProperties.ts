import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { timestamps } from "../helpers";
import { laptopsTable } from "./laptops";
import { propertiesTable } from "./properties";

export const laptopsToPropertiesTable = pgTable(
	"laptops_to_properties",
	{
		laptopId: integer("laptop_id")
			.notNull()
			.references(() => laptopsTable.id, { onDelete: "cascade" }),
		propertyId: integer("property_id")
			.notNull()
			.references(() => propertiesTable.id, { onDelete: "restrict" }),
		value: text("value").notNull(),
		...timestamps,
	},
	t => [primaryKey({ columns: [t.laptopId, t.propertyId] })]
);

export const laptopsToPropertiesRelations = relations(laptopsToPropertiesTable, ({ one }) => ({
	laptop: one(laptopsTable, {
		fields: [laptopsToPropertiesTable.laptopId],
		references: [laptopsTable.id],
	}),
	property: one(propertiesTable, {
		fields: [laptopsToPropertiesTable.propertyId],
		references: [propertiesTable.id],
	}),
}));
