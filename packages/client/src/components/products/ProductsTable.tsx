import type { Product } from './productsApi';
import ProductDescriptionDialog from './ProductDescriptionDialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';

const DESCRIPTION_PREVIEW_LENGTH = 80;

type Props = {
    products: Product[];
    onSelectProduct: (productId: number) => void;
};

const ProductsTable = ({ products, onSelectProduct }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => {
                    const description = product.description ?? '';
                    const isTruncated =
                        description.length > DESCRIPTION_PREVIEW_LENGTH;
                    const preview = isTruncated
                        ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}…`
                        : description;

                    return (
                        <TableRow key={product.id}>
                            <TableCell>
                                <button
                                    onClick={() => onSelectProduct(product.id)}
                                    className="cursor-pointer font-medium text-primary hover:underline"
                                >
                                    {product.name}
                                </button>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <span>{preview}</span>
                                    {isTruncated && (
                                        <ProductDescriptionDialog
                                            productName={product.name}
                                            description={description}
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default ProductsTable;
