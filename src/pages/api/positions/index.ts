import {NextApiRequest, NextApiResponse} from "next";
import {getAllListedPositions} from "@/prisma/positions";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    res.status(200).json(await getAllListedPositions())
}
export const config = {
    runtime: "edge"
}
