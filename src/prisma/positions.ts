import prisma from "@/prisma/prisma";
import {Position} from "@prisma/client";

export const getAllPositions = async () => {
    return prisma.position.findMany({});
}
export const getPositionByIdentifier = async (identifier: string) => {
    return prisma.position.findUnique({
        where: {
            identifier
        }
    });
}
export const getAllListedPositions = async () => {
    return prisma.position.findMany({
        where: {unlisted: false}
    });
}
export const createPosition = async (data: Position) => {
    return prisma.position.create({
        data
    });
}
