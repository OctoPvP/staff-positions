import {NextApiRequest, NextApiResponse} from "next";
import {withCaptcha} from "@/util/captcha";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({
        success: true
    });
}
export default withCaptcha(handler)