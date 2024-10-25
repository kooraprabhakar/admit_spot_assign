import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  const { email } = req.body;

  // Generate a one-time-code
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpiry = new Date(Date.now() + 3600000); // Expires in 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetExpiry },
  });

  // Send email to user with resetToken
  res.status(200).json({ message: 'Password reset link sent!' });
}

// Handle the password reset
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetExpiry: { gt: new Date() } },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetExpiry: null },
  });

  res.status(200).json({ message: 'Password updated successfully' });
}
