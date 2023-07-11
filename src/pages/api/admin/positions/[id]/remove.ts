import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {removePosition, setField} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    if (!ensureType(id, "string", res)) return;
    await removePosition(id as string);
    res.status(200).json({
        success: true,
        message: "Successfully removed position"
    });
}
export default withMethods(handler, "DELETE");
