import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getPositionByIdentifier} from "@/prisma/positions";
import {serialize} from "next-mdx-remote/serialize";
import {MDXRemote} from "next-mdx-remote";
import mdxComponents from "@/util/markdown";
import remarkGfm from "remark-gfm";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button, Link} from "@nextui-org/react";
import {FaArrowRight} from "react-icons/fa6";

const ViewPositionPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return (
        <>
            <div className={"border-b-2 pb-4 border-gray-500"}>
                <h1 className={"text-4xl font-bold text-center"}>{props.data.title}</h1>
                <p className={"text-2xl text-gray-400 text-center pt-4"}>{props.data.shortDescription}</p>
            </div>
            <div className={"flex flex-row"}>
                <Card className={"w-5/6 ml-6 mt-6 mr-3"}>
                    <CardBody className={""}>
                        <MDXRemote {...props.serializedDesc} components={mdxComponents}/>
                    </CardBody>
                </Card>
                <Card className={"w-1/6 mr-6 mt-6 ml-3 h-fit"}>
                    <CardBody>
                        <h1 className={"text-2xl font-bold text-center"}>
                            Apply
                        </h1>
                        <p className={"text-center text-gray-400 py-6"}>
                            Ready to apply? Click the button below to get started.
                        </p>
                        <div className={"flex flex-col w-full text-center"}>
                            <Link href={props.data.link}>
                                <Button color={"primary"} className={"w-full mx-4"}>
                                    Apply <FaArrowRight />
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default ViewPositionPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {id} = context.query;
    const data = await getPositionByIdentifier(id as string);
    if (!data) {
        return {
            notFound: true,
        };
    }
    const serializedDesc = await serialize(data.description, {
        mdxOptions: {
            rehypePlugins: [remarkGfm],
        },
    });
    return {
        props: {
            data,
            serializedDesc,
        },
    };
}
