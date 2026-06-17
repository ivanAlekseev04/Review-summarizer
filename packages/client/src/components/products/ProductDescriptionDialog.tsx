import { HiArrowsPointingOut } from 'react-icons/hi2';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';

type Props = {
    productName: string;
    description: string;
};

const ProductDescriptionDialog = ({ productName, description }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Show full description"
                >
                    <HiArrowsPointingOut />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{productName}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">{description}</p>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDescriptionDialog;
