import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <script
                    src={process.env.NEXT_PUBLIC_CAPTCHA_SCRIPT_SRC}
                    async
                    defer
                ></script>
            </Head>
            <body className={"min-h-screen bg-background font-sans antialiased"}>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
