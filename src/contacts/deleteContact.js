import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  const contact = await prisma.contact.update({
    where: { id: parseInt(id), userId: req.user.id },
    data: { deleted: true },
  });

  res.status(200).json({ message: 'Contact deleted (soft delete)' });
}
