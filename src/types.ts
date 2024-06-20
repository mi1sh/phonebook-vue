export type EditedItem = {
	f: string;
	i: string;
	o: string;
	city: string;
	address: string;
	birthday: string;
	phone: string;
	id?: number;
}

export type UpdateOptions = {
	page: number;
	sortBy: { key: string, order: string }[];
}

export type LoginFormValues = {
	email: string;
	password: string;
};