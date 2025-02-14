import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { uploadCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";
import { prisma } from "../lib/prisma"; 
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

const raiseComplaint = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }
  console.log(req.files);
  let complaintImageLocalPath: string | undefined;
  if (req.files && 'complaintImage' in req.files) {
    complaintImageLocalPath = req.files.complaintImage[0].path;
  }
  console.log(complaintImageLocalPath);
  if (!complaintImageLocalPath) {
    throw new ApiError(400, "Complaint Image is required");
  }

  const complaintImage = await uploadCloudinary(complaintImageLocalPath);
  if (!complaintImage) {
    throw new ApiError(500, "Something went wrong while uploading image");
  }

  const complaint = await prisma.complaint.create({
    data: {
      title,
      description,
      complaintImage: complaintImage.url,
      userId: req.user?.id as number, 
      isOpen: true,
    },
  });

  if (!complaint) {
    throw new ApiError(500, "Something went wrong while registering complaint");
  }

  return res.status(201).json(
    new ApiResponse(200, complaint, "Complaint Registered Successfully")
  );
});

const getAllComplaints = asyncHandler(async (
  _req: Request,
  res: Response
) => {
  const complaints = await prisma.complaint.findMany({
    where: {
      isOpen: true,
    },
    include: {
      user: {
        select: {
          name: true,
          rollNumber: true,
          department: true,
        },
      },
    },
  });

  if (!complaints || complaints.length === 0) {
    throw new ApiError(404, "No Complaints found");
  }

  return res.status(200).json(
    new ApiResponse(200, complaints, "Complaints fetched Successfully")
  );
});

const getComplaints = asyncHandler(async (
  req: any,
  res: Response
) => {
  const complaints = await prisma.complaint.findMany({
    where: {
      userId: req.user?.id,
      isOpen: true,
    },
    include: {
      user: {
        select: {
          name: true,
          rollNumber: true,
          department: true,
        },
      },
    },
  });

  if (!complaints || complaints.length === 0) {
    throw new ApiError(404, "No Complaints found");
  }

  return res.status(200).json(
    new ApiResponse(200, complaints, "Complaints fetched Successfully")
  );
});

export { raiseComplaint, getAllComplaints, getComplaints };