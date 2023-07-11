import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {setField} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {id} = req.query;
    if (!ensureType(id, "string", res)) return;
    const fieldName = req.query.key as string;
    const value = req.body[fieldName];
    await setField(id as string, {
        [fieldName]: value
    });
    res.status(200).json({
        success: true,
        message: `Successfully updated ${fieldName}`
    });
}
export default withMethods(handler, "POST");
export const config = {
    runtime: "edge"
}