import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";

import * as schema from "./schema";

if (
	!process.env.DB_HOST ||
	!process.env.DB_PORT ||
	!process.env.DB_NAME ||
	!process.env.DB_USER ||
	!process.env.DB_PASSWORD
) {
	throw new Error("DB_HOST, DB_PORT, DB_NAME, DB_USER or DB_PASSWORD are not set");
}

export const db = drizzle(
	encodeURI(
		`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
	),
	{ casing: "snake_case", schema }
);
