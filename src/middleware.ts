import protectedRoutes from "@root/access.config.json";
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

// I'm not sure if this regex stuff is the best way to do this, performance-wise and practically, but it works.
const compiledProtectedRoutes = protectedRoutes.map((route) => {
    return {
        ...route,
        regex: new RegExp(`^${route.path}`),
    };
});

export default async function middleware(
    req: NextRequest
) {
    const { pathname } = req.nextUrl;
    const isAPIRequest = req.method === "POST" || pathname.startsWith("/api/");
    // if (debug) debugLog("Pathname", pathname);
    const match = compiledProtectedRoutes.find((route) => {
        return route.regex.test(pathname);
    });
    if (match) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) {
            if (isAPIRequest) {
                return new NextResponse(
                        JSON.stringify({
                            success: false,
                            message: "Authentication required on this route.",
                        }),
                        {
                            status: 401,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
            }
            const url = new URL("/auth/signin", req.url);
            return NextResponse.rewrite(url);
        }
    }
    return NextResponse.next();
}