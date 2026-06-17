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
    author: string;
    content: string;
};

const ReviewContentDialog = ({ author, content }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Show full review"
                >
                    <HiArrowsPointingOut />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{author}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
                        {content}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewContentDialog;
