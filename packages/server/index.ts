import express, { type NextFunction } from 'express';
import router from './routes';
import type { Response, Request } from 'express';
import { NotFoundError } from './error/NotFoundError';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: "Internal server error" });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
