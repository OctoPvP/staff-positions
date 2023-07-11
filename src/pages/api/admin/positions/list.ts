import {NextApiRequest, NextApiResponse} from "next";
import {getAllPositions, getAllPositionsWithoutDescription} from "@/prisma/positions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.withDescription === "true") {
        res.status(200).json(await getAllPositions())
    } else {
        res.status(200).json(await getAllPositionsWithoutDescription())
    }
}
