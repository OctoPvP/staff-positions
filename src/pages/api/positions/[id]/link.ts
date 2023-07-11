import {NextApiRequest, NextApiResponse} from "next";
import {withCaptcha} from "@/util/captcha";
import {getAccessablePositionByIdentifier} from "@/prisma/positions";
import {ensureType, withMethods} from "@/util/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!ensureType(id, "string", res)) {
        return;
    }
    const data = await getAccessablePositionByIdentifier(id as string);
    if (!data) {
        res.status(404).json({
            error: true,
            success: false,
            message: "Position not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        link: data.link,
        embed: data.embedPage,
    });
}
export default withCaptcha(withMethods(handler, "POST")); // post because withCaptcha only works with post
