import { prisma } from '../../lib/prisma';
import { parse } from 'json2csv';

export default async function handler(req, res) {
  const contacts = await prisma.contact.findMany({
    where: { userId: req.user.id, deleted: false },
  });

  const csv = parse(contacts);
  res.setHeader('Content-Disposition', 'attachment;filename=contacts.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(csv);
}
