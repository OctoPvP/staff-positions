import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {Card, CardBody} from "@nextui-org/card";
import {Button} from "@nextui-org/react";
import {signIn} from "next-auth/react";
import {getServerSession} from "next-auth";
import {getAuthOptions} from "@/pages/api/auth/[...nextauth]";

const SignInPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return (
        <div className={"flex h-screen justify-center items-center flex-col"}>
            <Card>
                <CardBody>
                    <h1 className={"text-4xl font-bold text-center"}>Sign In</h1>
                    <p className={"text-2xl text-gray-400 text-center pt-4"}>
                        Sign in to your staff account to continue.
                    </p>
                    <Button color={"primary"} className={"w-full mt-4"} onPress={() => {
                        signIn("authentik", {callbackUrl: "/admin"});
                    }}>
                        Sign In With OctoAuth
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default SignInPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, getAuthOptions())
    if (session) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}
export const runtime = "edge";