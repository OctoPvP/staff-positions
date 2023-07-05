import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {AppWrapper} from "@/components/app";
import Script from "next/script";
import Head from "next/head";
import {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {SWRConfig} from "swr";
import {fetcher} from "@/util/swr";
import {DynamicModalProvider} from "@/components/dynamic-modal";

export type AppPropsWithSession = AppProps & {
    pageProps: {
        session: Session;
    }
};
export default function App({Component, pageProps}: AppPropsWithSession) {
    return (
        <>
            <Head>
                <title>OctoMC - Staff Positions</title>
                <meta name="description" content="OctoMC Staff Positions"/>
                <meta name="theme-color" content="#000000"/>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <Script src={"/assets/js/clarity.js"}/>
            <NextUIProvider>
                <NextThemesProvider attribute={"class"} defaultTheme={"dark"}>
                    <SWRConfig value={{
                        fetcher,
                        refreshInterval: 10000,
                    }}>
                        <DynamicModalProvider>
                            <SessionProvider session={pageProps.session}>
                                <AppWrapper>
                                    <Component {...pageProps} />
                                </AppWrapper>
                            </SessionProvider>
                        </DynamicModalProvider>
                    </SWRConfig>
                </NextThemesProvider>
            </NextUIProvider>
        </>
    )
}
