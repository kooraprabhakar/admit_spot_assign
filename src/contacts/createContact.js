import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const { name, email, phone, address, timezone } = req.body;
  const userId = req.user.id; // Assumes JWT Middleware to get user

  const contact = await prisma.contact.create({
    data: { name, email, phone, address, timezone, userId },
  });
  res.status(201).json(contact);
}
