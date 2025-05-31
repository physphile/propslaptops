import { text } from "drizzle-orm/pg-core";

export const timestamps = {
	createdAt: text("created_at")
		.$defaultFn(() => new Date().toISOString())
		.notNull(),
	updatedAt: text("updated_at")
		.$defaultFn(() => new Date().toISOString())
		.$onUpdateFn(() => new Date().toISOString())
		.notNull(),
};
