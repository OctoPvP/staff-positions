import axios from "axios";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
export const getSiteKey = () => {
    return process.env.SITE_KEY as string;
}
export type CaptchaResponse = {
    success: boolean,
    data?: any,
}
export const verifyCaptcha = async (token: string): Promise<CaptchaResponse> => {
    const providerUrl = process.env.CAPTCHA_PROVIDER_URL as string;
    const secretKey = process.env.CAPTCHA_SECRET_KEY as string;
    if (process.env.USE_CAPTCHA !== "true") {
        return {
            success: true,
        }
    }
    try {
        const formData = new FormData();
        formData.append("secret", secretKey);
        formData.append("response", token);
        const res = await axios.post(providerUrl, formData);
        return { data: res.data, success: res.data.success as boolean };
    } catch (error) {
        return {
            success: false,
        };
    }
}

export async function verifyCaptchaHandler(req: NextApiRequest, res: NextApiResponse) {
    if ((process.env.USE_CAPTCHA || "false") !== "true") {
        return true;
    }
    const captchaResponse = req.body[process.env.NEXT_PUBLIC_CAPTCHA_PARAM_NAME as string];
    if (!captchaResponse) {
        res.status(422).json({
            error: true,
            success: false,
            message: "Please complete the captcha",
        });
        return false;
    }
    const captchaSecret = process.env.CAPTCHA_SECRET_KEY;
    if (!captchaSecret) {
        res.status(422).json({
            error: true,
            success: false,
            message: "Captcha secret key not set",
        });
        return false;
    }
    const captchaVerification = await verifyCaptcha(captchaResponse);
    const { data } = captchaVerification;
    if (!data.success) {
        res.status(422).json({
            error: true,
            success: false,
            message: `Captcha verification failed: ${data["error-codes"]}`,
            // data: captchaVerification,
        });
        return false;
    }
    return true;
}

export const withCaptcha = (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method === "POST") {
            const captchaVerified = await verifyCaptchaHandler(req, res);
            if (!captchaVerified) {
                return;
            }
        }
        return handler(req, res);
    };
};