import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, verified: false },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Send verification email (email verification flow)
  res.status(201).json({ message: 'User created', token });
}
