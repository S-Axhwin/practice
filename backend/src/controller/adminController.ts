import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import userModel from "../model/user";
import jwt from "jsonwebtoken";
import { coursesArrayModel } from "../model/course";

const prisma = new PrismaClient();

//only login page
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isver = userModel.safeParse({email, password});
    if(!isver.success) return res.json({mes: isver.error.message});
    try {
        const isUser = await prisma.admin.findUnique({where: {email, password}});
        if(!isUser) return res.status(400).json({mes: "invaild credentials"});

        const token = jwt.sign({id: isUser.id}, process.env.SECRET as string);
        res.cookie("token", token);

        return res.json({mes: "logged in as user"});
    } catch (e) {
        return res.status(400).json({mes: "user not found"})
    }

}
// router.get("/courses", )       // get all the course
const getAllCourse = async (req: Request, res: Response) => {
    const courses = await prisma.courses.findMany();
    return res.json({courses});
}
// router.post("/courses", )      // add mulitply corses
const createCourses = async (req: Request, res: Response) => {
    const { courses } = req.body;
    const {success} = coursesArrayModel.safeParse(courses);
    if(!success) return res.status(201).json({mes: "invaild input send to backend"})
    try {
        const newCourse = await prisma.courses.createMany({
            data: courses
        });
        return res.json({mes: "created new courses"})
    } catch (e) {
        return res.status(301).json({mes: "something went wrong"});
    }
}
// router.put("/course/:id", )    // update single course
const updateSingleCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const changes = req.body;
    delete changes["id"];
    if(!id) return res.status(404).json({mes: "no course found"});

    const isExist = await prisma.courses.findUnique({
        where: {id}
    });
    if(!isExist) return res.json({mes: "course not found to update"});
    const courseUpdated = await prisma.courses.update({
        where: { id:isExist.id },
        data: {
            ...changes
        }
    });
    res.json({courseUpdated});
}
// router.delete("/course/:id", ) // delete single course
const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const delCourse = await prisma.courses.delete({
        where: {id}
    });
    return res.json({mes: "course deleted", delCourse});
}

export {
    createCourses,
    getAllCourse,
    login,
    updateSingleCourse,
    deleteCourse
}
