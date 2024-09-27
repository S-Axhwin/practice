import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if(!token) return res.json({mes: "login to see this page"});

    try {
        const { id } = jwt.verify(token, process.env.SECRET as string) as any;
        if(!id) throw new Error("not found");
        const isUser = await prisma.user.findUnique({
            where: {id,}
        });
        if(!isUser) throw new Error("not found");
        req.body.id = isUser.id;
        next();
    } catch(e) {
        return res.status(401).json({mes: "login to see this content"})
    }

}

export default middleware
