import { RequestHandler, Router } from "express";

import adminMiddleware from "../middleware/adminMiddleware";
const router = Router();
import {
    createCourses,
    getAllCourse,
    login,
    updateSingleCourse,
    deleteCourse
} from "../controller/adminController"
router.post("/login", login as any);

router.use(adminMiddleware as RequestHandler);

router.get("/courses", getAllCourse as any)       // get all the course
router.post("/courses", createCourses as any)      // add mulitply corses
router.put("/course/:id", updateSingleCourse as any)    // update single course
router.delete("/course/:id", deleteCourse as any) // delete single course

export default router;
