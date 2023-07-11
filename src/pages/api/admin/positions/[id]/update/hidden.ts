import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {setField} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    if (!ensureType(id, "string", res)) return;
    const {hidden} = req.body;
    if (!ensureType(hidden, "boolean", res)) return;
    await setField(id as string, {
        hidden
    });
    res.status(200).json({
        success: true,
        message: "Successfully updated listing status"
    });
}
export default withMethods(handler, "POST");
