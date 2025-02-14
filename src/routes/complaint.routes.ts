import { Router } from "express";
import { raiseComplaint,getAllComplaints,getComplaints } from "../controllers/complaint.controller";
// import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import multer from "multer";
const router = Router()

const upload = multer({ dest: 'uploads/' })
router.route("/add-rating").post(
    verifyJWT,
    upload.fields([
        {
            name : "complaintImage",
            maxCount : 1
        },
    ]),
    raiseComplaint
)

router.route("/").get(
    verifyJWT,
    getAllComplaints
)
router.route("/me").get(
    verifyJWT,
    getComplaints
)




export default router