import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollNumber: z.string().length(9, 'Institute roll number is required'),
  phoneNumber: z.string().length(10, 'Phone number is required'),
  yearOfPassing: z.number().int('Year must be a valid integer'),
  emailId: z.string().email('Valid email is required'),
  instituteEmailId: z.string().email('Valid institute email is required'),
  dateOfBirth: z.string().refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Valid date of birth is required. Format should be YYYY-MM-DD',
  }),
  emergencyMobileNumber: z.string(),
  roomNumber: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const verifyEmailSchema = z.object({
  emailId: z.string().email('Valid email is required'),
  instituteEmailId: z.string().email('Valid institute email is required'),
  code: z.string().min(1, 'Verification code is required'),
});

export const loginSchema = z.object({
  emailId: z.string().email('Valid email is required').optional(),
  instituteEmailId: z.string().email('Valid institute email is required').optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.emailId || data.instituteEmailId, {
  message: 'Email address is required',
  path: ['emailId', 'instituteEmailId'],
});

export const resendVerificationSchema = z.object({
  emailId: z.string().email('Valid email is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;