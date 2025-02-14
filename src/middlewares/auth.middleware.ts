import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { log } from "console";

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
 user?: any;
}

// Define JWT payload type
interface JwtPayload {
 userId: number; // Changed to number since we're using autoincrement in Prisma
}

export const verifyJWT = asyncHandler(async (
 req: AuthenticatedRequest,
 _: Response,
 next: NextFunction
) => {
 try {
   const token = req.cookies?.accessToken || 
                req.header("Authorization")?.replace("Bearer ", "");
   
   console.log(token);
   
   if (!token) {
     throw new ApiError(401, "Unauthorised Access");
   }

   const decodedToken = jwt.verify(
     token,
     process.env.JWT_SECRET as string
   ) as JwtPayload;
   console.log(decodedToken);
   const user = await prisma.user.findUnique({
     where: {
       id: decodedToken.userId
     },
     select: {
       id: true,
       rkId: true,
       name: true,
       rollNumber: true,
       phoneNumber: true,
       yearOfPassing: true,
       emailId: true,
       instituteEmailId: true,
       dateOfBirth: true,
       department: true,
       emergencyMobileNumber: true,
       roomNumber: true,
       isVerified: true,
       createdAt: true,
     }
   });

   if (!user) {
     throw new ApiError(401, "Invalid Access Token");
   }

   req.user = user;
   next();
 } catch (error) {
   if (error instanceof Error) {
     throw new ApiError(401, error.message || "Invalid Access Token");
   }
   throw new ApiError(401, "Invalid Access Token");
 }
});