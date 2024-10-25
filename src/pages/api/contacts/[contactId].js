import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  const { contactId } = req.query;

  try {
    if (req.method === 'GET') {
      // Get contact details
      const contact = await prisma.contact.findUnique({
        where: { id: parseInt(contactId, 10) },
      });
      if (!contact) return res.status(404).json({ error: 'Contact not found' });
      res.status(200).json(contact);

    } else if (req.method === 'PUT') {
      // Update contact details
      const { name, email, phone, address, timezone } = req.body;
      const updatedContact = await prisma.contact.update({
        where: { id: parseInt(contactId, 10) },
        data: { name, email, phone, address, timezone },
      });
      res.status(200).json(updatedContact);

    } else if (req.method === 'DELETE') {
      // Soft delete contact
      await prisma.contact.update({
        where: { id: parseInt(contactId, 10) },
        data: { deleted: true },
      });
      res.status(200).json({ message: 'Contact soft deleted' });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
