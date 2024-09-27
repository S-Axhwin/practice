import { RequestHandler, Router } from "express";

import userMiddleware from "../middleware/userMiddleware";
const router = Router();

import {
    login,
    register,
    getAllCourse,
    getById,
    purchCourse
} from "../controller/userController";

router.post("/login", login as any);
router.post("/register", register as any);
router.get("/courses", getAllCourse as any);

// private using middleware
router.get("/course/:id", userMiddleware as RequestHandler, getById as any);
router.put("/course/:id", userMiddleware as RequestHandler,purchCourse as any);

export default router;
