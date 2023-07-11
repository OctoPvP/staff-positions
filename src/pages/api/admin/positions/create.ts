import {NextApiRequest, NextApiResponse} from "next";
import {ensureType, withMethods} from "@/util/server";
import {Position} from "@prisma/client";
import {createPosition} from "@/prisma/positions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {identifier, title, shortDescription, link} = req.body;
    if (!identifier || !title || !link) {
        res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
        return;
    }
    // validate
    if (!ensureType(identifier, "string", res) || !ensureType(title, "string", res)
        || !ensureType(link, "string", res)
    ) return;
    if (shortDescription && !ensureType(shortDescription, "string", res)) return;
    if (identifier.length <= 0) {
        res.status(400).json({
            success: false,
            message: "Identifier cannot be empty"
        });
        return;
    }
    await createPosition(
        {
            identifier: identifier.toLowerCase(),
            title,
            shortDescription: shortDescription || "",
            description: "",
            link,
            unlisted: req.query.listed === "true"
        }
    )
    res.status(200).json({
        success: true,
        message: "Successfully created position",
    });
}
export default withMethods(handler, "POST");
