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
export const getAccessablePositionByIdentifier = async (identifier: string) => {
    // find one where hidden is false and identifier is identifier
    return prisma.position.findFirst({
        where: {
            hidden: false,
            identifier,
        }
    });
}

export const getAllListedPositions = async () => {
    const data = await prisma.position.findMany({
        where: {unlisted: false, hidden: false},
        orderBy: {
            priority: 'desc'
        }
    });
    // if data.captcha is true, then set link to empty
    return data.map(position => {
        if (position.captcha) {
            position.link = "";
        }
        return position;
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
