import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "", 
    api_key: process.env.CLOUDINARY_API_KEY || "", 
    api_secret: process.env.CLOUDINARY_API_SECRET || ""
});

const uploadCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;
        
        const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        
        console.log(response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export { uploadCloudinary };