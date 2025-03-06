import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePasswords, generateToken, generateOTP } from '../utils/auth';
import { sendVerificationEmail } from '../utils/email';
import { generateRkId } from '../utils/generateRkId';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  resendVerificationSchema,
} from '../schemas/auth.schema';
import { Department } from '../constants/departments';

const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const data = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { emailId: data.emailId },
          { rollNumber: data.rollNumber },
          { phoneNumber: data.phoneNumber },
          { instituteEmailId: data.instituteEmailId },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(data.password);
    const verificationCode = generateOTP();
    const verificationExpires = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

    const rkId = await generateRkId(data.rollNumber);
    const department = data.rollNumber.slice(2, 4) as Department;

    await prisma.tempUser.create({
      data: {
        ...data,
        rkId,
        department,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
        dateOfBirth: new Date(data.dateOfBirth),
      },
    });

    await sendVerificationEmail(data.emailId, verificationCode);

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const result = verifyEmailSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    const { emailId, code } = result.data;
    const user = await prisma.user.findUnique({
      where: { emailId },
    });
    if (user){
      return res.status(400).json({ message: 'Email already verified' });
    }
    const tempuser = await prisma.tempUser.findUnique({
      where: { emailId },
    });

    if (!tempuser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      !tempuser.verificationCode ||
      tempuser.verificationCode !== code ||
      !tempuser.verificationExpires ||
      tempuser.verificationExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    const ver_user = {
      name: tempuser.name,
      rollNumber: tempuser.rollNumber,
      phoneNumber: tempuser.phoneNumber,
      rkId: tempuser.rkId,
      department: tempuser.department,
      emailId: tempuser.emailId,
      instituteEmailId: tempuser.instituteEmailId,
      yearOfPassing: tempuser.yearOfPassing,
      dateOfBirth: tempuser.dateOfBirth,
      emergencyMobileNumber: tempuser.emergencyMobileNumber,
      roomNumber: tempuser.roomNumber,
      password: tempuser.password,
    }
    await prisma.user.create({
      data: {
        ...ver_user,

      },
    });

    await prisma.tempUser.delete({
      where: { emailId },
    });
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    const { emailId, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { emailId },
    });
    const tempuser = await prisma.tempUser.findUnique({
      where: { emailId },
    });
    if (!user && !tempuser) {
      return res.status(401).json({ message: 'Invalid credentials ' });
    }

    if (!user && tempuser) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        rollNumber: user.rollNumber,
        phoneNumber: user.phoneNumber,
        rkId: user.rkId,
        department: user.department,
        emailId: user.emailId,
        instituteEmailId: user.instituteEmailId,
        yearOfPassing: user.yearOfPassing,
        dateOfBirth: user.dateOfBirth,
        emergencyMobileNumber: user.emergencyMobileNumber,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const result = resendVerificationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    const { emailId } = result.data;

    const user = await prisma.user.findUnique({
      where: { emailId },
    });
    const tempuser = await prisma.tempUser.findUnique({
      where: { emailId },
    });
    if (!user && !tempuser) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (user) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!tempuser) {
      return res.status(404).json({ message: 'Temporary user not found' });
    }

    const verificationCode = generateOTP();
    const verificationExpires = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

    await prisma.tempUser.update({
      where: { id: tempuser.id },
      data: {
        verificationCode,
        verificationExpires,
      },
    });

    await sendVerificationEmail(emailId, verificationCode);

    res.json({ message: 'Verification code resent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend verification code' });
  }
};