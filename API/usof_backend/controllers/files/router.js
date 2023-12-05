import { Router } from 'express';
const router = Router();
import fs from 'fs';

import * as url from 'url';
import sharp from 'sharp';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

router.post('/',  async (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.hostname;
        // eslint-disable-next-line no-undef
        const port = process.env.PORT;
        const baseURL = `${protocol}://${host}:${port}/`;
    
        fs.access(__dirname + "../../resources/post_images", (error) => {
            if (error) {
                fs.mkdirSync(__dirname + "../../resources/post_images");
            }
        });
        if (!req.files?.image) return res.sendStatus(400);
        const { data, name } = req.files.image;
        const timestamp = new Date().toISOString();
        const ref = `${timestamp}-${name}.webp`;
        await sharp(data)
            .webp({ quality: 20 })
            .toFile(__dirname + "../../resources/post_images/" + ref);
        const link = `${baseURL}api/files/image/${ref}`;
        return res.json({ link });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

export default router;
