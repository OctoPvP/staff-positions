import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getAccessablePositionByIdentifier} from "@/prisma/positions";
import PositionCaptcha from "@/components/position-captcha";
import {useRouter} from "next/router";

const ViewFormPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const router = useRouter();

    const [embedLink, setEmbedLink] = React.useState<string>("");
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            {embedLink ? (
                <iframe src={embedLink}
                        className="fixed top-0 left-0 bottom-0 right-0 w-full h-full m-0 p-0 overflow-hidden"/>
            ) : (
                <>
                    <PositionCaptcha data={props.data} callback={(link, embed) => {
                        setEmbedLink(link);
                    }}/>
                </>
            )}
        </div>
    );
};

export default ViewFormPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {id} = context.query;
    const data = await getAccessablePositionByIdentifier(id as string);
    if (!data) {
        return {
            notFound: true,
        };
    }
    if (!data.embedPage) {
        return {
            redirect: {
                destination: `/position/${data.identifier}`,
                permanent: false,
            }
        };
    }
    if (data.captcha) {
        data.link = "";
    }
    return {
        props: {
            data,
        },
    };
}
export const runtime = "edge";