import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

function requireMethod(
    req: NextApiRequest,
    res: NextApiResponse,
    ...method: string[]
) {
    if (!method.includes(req.method || "")) {
        res.status(405).json({
            success: false,
            message: "Method Not Allowed. Accepted methods are: " + method.join(", "),
        });
        return false;
    }
    return true;
}
const withMethods = (
    handler: NextApiHandler,
    ...method: string[]
): NextApiHandler => {
    return async (req, res) => {
        if (!requireMethod(req, res, ...method)) return;
        return handler(req, res);
    };
};
const ensureType = (object: any, type: string, res: NextApiResponse) => {
    if (typeof object !== type) {
        res.status(400).json({
            success: false,
            message: `Expected ${type} but got ${typeof object}`,
        });
        return false;
    }
    return true;
}
export { requireMethod, withMethods, ensureType };