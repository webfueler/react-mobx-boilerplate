interface ProductRating {
	rate: number;
	count: number;
}

interface Product {
	id: number;
	title: string;
	price: number;
	category: string;
	description: string;
	image: string;
	rating: ProductRating;
}

export type { Product, ProductRating };
