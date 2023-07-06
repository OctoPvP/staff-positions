import prisma from "@/prisma/prisma";
import {Prisma} from "@prisma/client";

export const getAllPositions = async () => {
    return prisma.position.findMany({
        orderBy: {
            priority: 'desc'
        }
    });
}
export const getPositionByIdentifier = async (identifier: string) => {
    return prisma.position.findUnique({
        where: {
            identifier,
        }
    });
}

export const getAllListedPositions = async () => {
    return prisma.position.findMany({
        where: {unlisted: false, hidden: false},
        orderBy: {
            priority: 'desc'
        }
    });
}
export const createPosition = async (data: (Prisma.Without<Prisma.PositionCreateInput, Prisma.PositionUncheckedCreateInput> & Prisma.PositionUncheckedCreateInput) | (Prisma.Without<Prisma.PositionUncheckedCreateInput, Prisma.PositionCreateInput> & Prisma.PositionCreateInput)) => {
    return prisma.position.create({
        data
    });
}
export const getAllPositionsWithoutDescription = async () => {
    // get all but remove description to save bandwidth
    return prisma.position.findMany({
        orderBy: {
            priority: 'desc'
        }
    })
        .then(positions => positions.map(position => {
            position.description = "";
            return position;
        }));
}

export const setField = async (id: string, data: any) => {
    return prisma.position.update({
        where: {
            identifier: id.toLowerCase()
        },
        data
    });
}
export const removePosition = async (id: string) => {
    return prisma.position.delete({
        where: {
            identifier: id.toLowerCase()
        }
    });
}
