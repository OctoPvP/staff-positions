import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {setField} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    if (!ensureType(id, "string", res)) return;
    const {identifier} = req.body;
    if (!ensureType(identifier, "string", res)) return;
    if (identifier.length <= 0) {
        res.status(400).json({
            success: false,
            message: "Identifier cannot be empty"
        });
        return;
    }
    await setField(id as string, {
        identifier: identifier.toLowerCase()
    });
    res.status(200).json({
        success: true,
        message: "Successfully updated identifier"
    });
}
export default withMethods(handler, "POST");
