import { prisma } from '../../lib/prisma';
import { convertToTimezone } from '../utils/timezoneHelper';

export default async function handler(req, res) {
  const { startDate, endDate, timezone } = req.query;

  const contacts = await prisma.contact.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      userId: req.user.id,
      deleted: false,
    },
  });

  const results = contacts.map(contact => ({
    ...contact,
    createdAt: convertToTimezone(contact.createdAt, timezone),
  }));

  res.status(200).json(results);
}
