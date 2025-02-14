import { z } from "zod";

export const ComplaintSchema = z.object({
  complaintImage: z.string().min(1, "Complaint image is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isOpen: z.boolean().default(true),
  responseMessage: z.string().optional(),
  userId: z.number()
});

export type ComplaintInput = z.infer<typeof ComplaintSchema>;
