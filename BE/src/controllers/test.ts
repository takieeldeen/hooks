import { prisma } from "../lib/prisma";
import { NextFunction ,Response,Request} from "express";

export const testFn = async (req:Request,res:Response,next:NextFunction) =>{
    const users = await prisma.user.findMany();
    res.status(200).json({
        users,
    })
}