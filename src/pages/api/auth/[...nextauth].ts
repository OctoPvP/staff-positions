import {NextApiRequest, NextApiResponse} from "next";
import NextAuth, {AuthOptions} from "next-auth";
import AuthentikProvider from "next-auth/providers/authentik";

export function nextAuth(
    req: NextApiRequest | null,
    res: NextApiResponse | null
) {
    const options: AuthOptions = {
        pages: {
            signIn: "/auth/signin",
        },
        providers: [
            AuthentikProvider({
                clientId: process.env.AUTHENTIK_CLIENT_ID || "",
                clientSecret: process.env.AUTHENTIK_CLIENT_SECRET || "",
                issuer: process.env.AUTHENTIK_ISSUER,
                client: {
                    authorization_signed_response_alg: 'HS256',
                    id_token_signed_response_alg: 'HS256'
                }
            })
        ],
        session: {
            strategy: "jwt",
            maxAge: 24 * 60 * 60, // 24 hours
        },
        jwt: {
            maxAge: 24 * 60 * 60, // 24 hours
        },
        secret: process.env.NEXTAUTH_SECRET,
        theme: {
            colorScheme: "dark",
        },
    };
    if (req && res) {
        return NextAuth(req, res, options);
    }
    return NextAuth(options);
}

export function getAuthOptions(): AuthOptions {
    return nextAuth(null, null).authOptions;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    return nextAuth(req, res);
}

export default handler;