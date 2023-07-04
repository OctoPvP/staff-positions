import React, {useEffect} from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getServerSession} from "next-auth";
import {getAuthOptions} from "@/pages/api/auth/[...nextauth]";
import {Card, CardBody} from "@nextui-org/card";
import {signOut} from "next-auth/react";

const SignoutPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    useEffect(() => {
        signOut({callbackUrl: "/"}).then(() => {
            window.location.href = "/";
        });
    }, [])
    return (
        <>
            <div className={"flex h-screen justify-center items-center flex-col"}>
                <Card>
                    <CardBody>
                        Signing you out...
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default SignoutPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, getAuthOptions())
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}
