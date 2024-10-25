import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const { name, email, phone, address, timezone } = req.body;

  const contact = await prisma.contact.update({
    where: { id: parseInt(id), userId: req.user.id },
    data: { name, email, phone, address, timezone },
  });

  res.status(200).json(contact);
}
