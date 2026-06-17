import axios from 'axios';

export type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
};

export type CreateProductInput = {
    name: string;
    description: string;
    price: number;
};

export const productsApi = {
    fetchProducts() {
        return axios.get<Product[]>('/api/products').then((res) => res.data);
    },

    createProduct(input: CreateProductInput) {
        return axios
            .post<Product>('/api/products', input)
            .then((res) => res.data);
    },
};
