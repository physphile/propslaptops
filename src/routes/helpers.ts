import type { Laptop } from "./types";

export const unpackLaptop = ({ createdAt, id, laptopsToProperties, updatedAt }: Laptop) => {
	return {
		createdAt,
		id,
		properties: Object.fromEntries(laptopsToProperties.map(({ property, value }) => [property.name, value])),
		updatedAt,
	};
};
