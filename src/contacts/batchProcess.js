import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const contacts = req.body.contacts;
  const userId = req.user.id;

  const promises = contacts.map(contact => {
    return prisma.contact.upsert({
      where: { email: contact.email, userId },
      update: { ...contact },
      create: { ...contact, userId },
    });
  });

  await Promise.all(promises);

  res.status(200).json({ message: 'Contacts batch processed successfully' });
}
