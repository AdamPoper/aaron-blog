import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
    },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    cb(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
