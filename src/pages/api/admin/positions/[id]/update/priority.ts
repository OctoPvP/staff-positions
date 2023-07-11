import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {setField} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    if (!ensureType(id, "string", res)) return;
    const {priority} = req.body;
    if (!ensureType(priority, "number", res)) return;
    await setField(id as string, {
        priority: priority as number
    });
    res.status(200).json({
        success: true,
        message: "Successfully updated listing priority"
    });
}
export default withMethods(handler, "POST");
