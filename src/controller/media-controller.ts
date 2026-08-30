import { Request, Response } from 'express';

export class MediaController {

    static uploadImage(req: Request, res: Response): void {
        if (!req.file) {
            res.status(400).json({ error: 'image file is required' });
            return;
        }

        res.status(201).json({ url: `/uploads/${req.file.filename}` });
    }
}
