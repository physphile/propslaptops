import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (
	!process.env.DB_NAME ||
	!process.env.DB_HOST ||
	!process.env.DB_PASSWORD ||
	!process.env.DB_PORT ||
	!process.env.DB_USER
) {
	throw new Error("DB_NAME, DB_HOST, DB_PASSWORD, DB_PORT or DB_USER are not set");
}

export default defineConfig({
	dbCredentials: {
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: Number.parseInt(process.env.DB_PORT),
		user: process.env.DB_USER,
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/database/schema",
});
