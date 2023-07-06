import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getPositionByIdentifier} from "@/prisma/positions";
import {serialize} from "next-mdx-remote/serialize";
import {MDXRemote} from "next-mdx-remote";
import mdxComponents from "@/util/markdown";
import remarkGfm from "remark-gfm";
import {Card, CardBody} from "@nextui-org/card";
import {Button, Link} from "@nextui-org/react";
import {FaArrowRight} from "react-icons/fa6";

const ViewPositionPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return (
        <div className={"pt-20"}>
            <div className={"border-b-2 pb-4 border-gray-500"}>
                <h1 className={"text-4xl font-bold text-center"}>{props.data.title}</h1>
                <p className={"text-2xl text-gray-400 text-center pt-4"}>{props.data.shortDescription}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 md:pl-12">
                <Card className="col-span-3 m-6 md:mr-3 sm:mb-3 h-fit">
                    <CardBody>
                        {props.serializedDesc ? (<MDXRemote {...props.serializedDesc} components={mdxComponents}/>) : (
                            <p className="text-center text-gray-400 py-6">
                                Error rendering markdown.
                            </p>
                        )}
                    </CardBody>
                </Card>
                <div className={"flex w-full"}>
                    <aside className="h-screen sticky top-8 w-full">
                        <Card className="col-span-1 w-fit m-6 md:ml-3 h-fit">
                            <CardBody>
                                <h1 className="text-2xl font-bold text-center">Apply</h1>
                                <p className="text-center text-gray-400 py-6">
                                    Ready to apply? Click the button below to get started.
                                </p>
                                <div className="flex flex-col w-full text-center">
                                    <Link href={props.data.link} className={"outline-0"}>
                                        <Button color="primary" className="w-full mx-4">
                                            Apply <FaArrowRight/>
                                        </Button>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ViewPositionPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {id} = context.query;
    const data = await getPositionByIdentifier(id as string);
    if (!data || data.hidden) {
        return {
            notFound: true,
        };
    }
    let serializedDesc;
    try {
        serializedDesc = await serialize(data.description, {
            mdxOptions: {
                rehypePlugins: [remarkGfm],
            },
        });
    } catch (e) {
        console.error(e);
        serializedDesc = null;
    }
    return {
        props: {
            data,
            serializedDesc,
        },
    };
}
