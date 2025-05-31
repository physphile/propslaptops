import { relations } from "drizzle-orm";
import { pgTable, serial } from "drizzle-orm/pg-core";

import { timestamps } from "../helpers";
import { laptopsToPropertiesTable } from "./laptopsToProperties";

export const laptopsTable = pgTable("laptops", {
	id: serial("id").primaryKey(),
	...timestamps,
});

export const laptopsRelations = relations(laptopsTable, ({ many }) => ({
	laptopsToProperties: many(laptopsToPropertiesTable),
}));
