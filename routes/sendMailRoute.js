import express from 'express';
import { sendEmail } from '../controllers/sendMailController.js'

const router = express.Router();

// GET /api/
router.get("/", (req, res) => {
    res.json({
        message: "This is the category route."
    });
});

// POST /api/create
router.post("/", sendEmail);



export default router;
