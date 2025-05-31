import { t } from "elysia";

export const PropertyTypeSchema = t.UnionEnum(["string", "number", "boolean", "enum"]);

export const PropertyValueSchema = t.Union([t.String({ minLength: 1 }), t.Number(), t.Boolean()]);
