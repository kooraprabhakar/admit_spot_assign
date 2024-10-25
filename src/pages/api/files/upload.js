import formidable from 'formidable';
import { parseCSVFile } from '../../../utils/fileUtils';
import { prisma } from '../../../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ uploadDir: './public/uploads', keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'File upload error' });

      const file = files.file;
      try {
        const contacts = await parseCSVFile(file.filepath); // parseCSVFile is a helper function to parse CSV files

        // Bulk insert contacts to database
        await prisma.contact.createMany({
          data: contacts.map(contact => ({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
            timezone: contact.timezone,
          })),
        });

        res.status(201).json({ message: 'Contacts uploaded successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to process file' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
