import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const { search, sort, timezone } = req.query;
  const userId = req.user.id;

  const contacts = await prisma.contact.findMany({
    where: {
      userId,
      name: { contains: search },
      timezone: timezone,
      deleted: false,
    },
    orderBy: { name: sort === 'asc' ? 'asc' : 'desc' },
  });

  res.status(200).json(contacts);
}
