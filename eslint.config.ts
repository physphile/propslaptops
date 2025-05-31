import js from "@eslint/js";
// @ts-expect-error no types
import importPlugin from "eslint-plugin-import";
// @ts-expect-error no types
// eslint-disable-next-line import/no-unresolved
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
// @ts-expect-error no types
import pluginPromise from "eslint-plugin-promise";
// @ts-expect-error no types
import pluginSecurity from "eslint-plugin-security";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "eslint/config";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		ignores: ["**/*.d.ts", "dist"],
	},
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		extends: ["js/recommended"],
		files: ["**/*.{js,mjs,cjs,ts}"],
		plugins: { js },
	},
	tseslint.configs.recommended,
	perfectionist.configs["recommended-natural"],
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	eslintPluginPrettier,
	eslintPluginUnicorn.configs.all,
	pluginSecurity.configs.recommended,
	pluginPromise.configs["flat/recommended"],
	{
		rules: {
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			"unicorn/filename-case": "off",
			"unicorn/no-array-callback-reference": "off",
			"unicorn/no-keyword-prefix": "off",
			"unicorn/prefer-ternary": "off",
			"unicorn/prevent-abbreviations": "off",
		},
	},
]);
