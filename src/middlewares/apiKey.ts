import { Elysia } from "elysia";

export const apiKeyMiddleware = new Elysia().onRequest(({ request, set }) => {
	const apiKey = request.headers.get("x-api-key");
	const validApiKeys = process.env.API_KEYS?.split(",") || [];

	if (!apiKey || !validApiKeys.includes(apiKey)) {
		set.status = 401;
		return {
			error: "Unauthorized",
			message: "Invalid or missing API key",
		};
	}
});
