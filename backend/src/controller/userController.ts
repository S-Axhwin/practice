import { Request, Response } from "express"
import userModel from "../model/user";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isver = userModel.safeParse({email, password});
    if(!isver.success) return res.json({mes: isver.error.message});
    try {
        const isUser = await prisma.user.findUnique({where: {email, password}});
        if(!isUser) return res.status(400).json({mes: "invaild credentials"});

        const token = jwt.sign({id: isUser.id}, process.env.SECRET as string);
        res.cookie("token", token);

        return res.json({mes: "logged in as user"});
    } catch (e) {
        return res.status(400).json({mes: "user not found"})
    }

}

const register =  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isver = userModel.safeParse({email, password});
    if(!isver.success) return res.status(401).json({mes: isver.error.message});
    try {
        const newUser = await prisma.user.create({
            data: { email, password }
        });
        return res.json({mes: "user created"});
    } catch(e) {
        return res.status(401).json({mes: "user already exist"})
    }
}

const getAllCourse = async (req: Request, res: Response) => {
    const courses = await prisma.courses.findMany();
    return res.json({courses})
}

const getById = (req: Request, res: Response) => {
    const {id} = req.params;

    const course = prisma.courses.findFirst({
        where: {id}
    });

    console.log(id);
    return res.json({id, course});
}

const purchCourse = async (req: Request, res: Response) => {
    const { id:userId, purchId } = req.body;
    // console.log(userId);
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                courses: {
                    connect: {id: purchId}
                }
            },
        });
        return res.json({mes: "purchased course successfully", updatedUser})
    } catch (e) {
        return res.status(400).json({mes: "unable to purchase course at the moment"});

    }

    return res.json({userId});
}


export {
    login,
    register,
    getAllCourse,
    getById,
    purchCourse
}
