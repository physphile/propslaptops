export type Laptop = {
	createdAt: string;
	id: number;
	laptopsToProperties: Array<{
		property: {
			name: string;
		};
		value: string;
	}>;
	updatedAt: string;
};
