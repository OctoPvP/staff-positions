import {NextApiRequest, NextApiResponse} from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        success: true,
        enabled: process.env.USE_CAPTCHA === "true",
        jsWindowName: process.env.NEXT_PUBLIC_CAPTCHA_JS_WINDOW_NAME as string,
        paramName: process.env.NEXT_PUBLIC_CAPTCHA_PARAM_NAME as string,
        siteKey: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string,
    })
}

export default handler;
