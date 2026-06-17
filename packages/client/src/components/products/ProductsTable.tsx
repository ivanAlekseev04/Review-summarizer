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
        <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-card/60">
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
                                        onClick={() =>
                                            onSelectProduct(product.id)
                                        }
                                        className="cursor-pointer font-semibold text-foreground transition-colors hover:text-accent-purple"
                                    >
                                        {product.name}
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <span>{preview}</span>
                                        {isTruncated && (
                                            <ProductDescriptionDialog
                                                productName={product.name}
                                                description={description}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="rounded-full bg-accent-yellow/10 px-2.5 py-1 text-xs font-semibold text-accent-yellow">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProductsTable;
