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
import {Position} from "@prisma/client";
import {getSiteKey} from "@/util/captcha";
import {useDynamicModal} from "@/components/dynamic-modal";
import {Button as NextUIButton} from "@nextui-org/button";
import CustomButton from "@/components/button";
import axios from "axios/index";
import {mutate} from "swr";
import CaptchaWidget from "@/components/captcha";
import PositionCaptcha from "@/components/position-captcha";
import {useRouter} from "next/router";

const ViewPositionPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const { showModal, closeModal } = useDynamicModal();
    const router = useRouter();
    const LinkWrapper = ({href, children, data}: { href: string; children: any; data: Position }) => {
        if (!data.captcha) {
            return (
                <Link href={data.embedPage ? `/apply/${data.identifier}` : href} className={"outline-0"}>
                    {children}
                </Link>
            )
        }
        return (
            <>
                <div className={"outline-0 w-full max-w-full"}>
                    {children}
                </div>
            </>
        );
    }
    return (
        <div className={"pt-20"}>
            <div className={false ? "border-b-2 pb-4 border-gray-500" : "pb-4"}>
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
                                    <LinkWrapper href={props.data.link} data={props.data}>
                                        <Button color="primary" className={"w-full"} onPress={() => {
                                            if (props.data.captcha) {
                                                if (props.data.embedPage) { // embed page will handle captcha
                                                    router.push(`/apply/${props.data.identifier}`);
                                                    return;
                                                }
                                                showModal({
                                                    title: "Please solve the captcha",
                                                    body: (
                                                        <>
                                                            <PositionCaptcha data={props.data} />
                                                        </>
                                                    ),
                                                    footer: (
                                                        <>

                                                        </>
                                                    ),
                                                });
                                            }
                                        }}>
                                            Apply <FaArrowRight/>
                                        </Button>
                                    </LinkWrapper>
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
    let otherData = null;
    if (data.captcha) {
        data.link = "";
        otherData = {
            siteKey: await getSiteKey()
        }
    } else otherData = {}
    return {
        props: {
            data,
            serializedDesc,
            ...otherData
        },
    };
}
