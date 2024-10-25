import multer from 'multer';
import csv from 'csv-parser';
import { prisma } from '../../lib/prisma';
import fs from 'fs';

const upload = multer({ dest: 'public/uploads/' });

export default function handler(req, res) {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'File upload failed' });

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process results
        const promises = results.map(contact => {
          return prisma.contact.create({ data: { ...contact, userId: req.user.id } });
        });

        await Promise.all(promises);
        res.status(200).json({ message: 'Contacts uploaded successfully' });
      });
  });
}
