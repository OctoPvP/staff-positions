import React, {HTMLInputTypeAttribute} from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getPositionByIdentifier} from "@/prisma/positions";
import {Card, CardBody} from "@nextui-org/card";
import MarkdownEditor from "@/components/admin/markdown-editor";
import CustomButton from "@/components/button";
import axios from "axios";
import {MDXRemote} from "next-mdx-remote";
import mdxComponents from "@/util/markdown";
import {Input} from "@nextui-org/input";
import {useRouter} from "next/router";
import {Position} from "@prisma/client";


const EditPositionPage = (
    {position}: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const router = useRouter();
    const [description, setDescription] = React.useState(position?.description);
    const [unlisted, setUnlisted] = React.useState(position?.unlisted);
    const [hidden, setHidden] = React.useState(position?.hidden);
    const SettingCard = ({title, position, fieldName, callback = null, inputType = "text"}: { title: string, position: Position, fieldName: string, callback?: ((result: any) => void) | null, inputType?: HTMLInputTypeAttribute | undefined}) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        return (
            <Card className="col-span-2 m-6 md:mr-3 sm:mb-3 h-fit">
                <CardBody>
                    <h1 className="text-2xl font-bold text-center pb-2">{title}</h1>
                    <Input type={inputType} label={title} placeholder={(position as any)[fieldName]} defaultValue={(position as any)[fieldName]} ref={inputRef}/>
                    <CustomButton color={"primary"} className={"w-full mt-4"} onClickLoading={() => {
                        const newField = inputRef.current?.value;
                        return axios.post(`/api/admin/positions/${position.identifier}/update/${fieldName}`, {
                            [fieldName]: newField,
                        }).then(() => {
                            if (callback) {
                                console.log("callback");
                                callback(newField);
                                console.log("callback1");
                            }
                        });
                    }}>Save</CustomButton>
                </CardBody>
            </Card>
        );
    }
    return (
        <div className={"pt-16"}>
            <h1 className={"text-4xl font-bold text-center pb-4"}>Edit Position: {position.title}</h1>
            {/* Edit the fields identifier, description, link, shortDescription, title, unlisted */}
            <Card className={"mx-6 mr-4"}>
                <CardBody>
                    <MarkdownEditor value={description} onChange={setDescription}/>
                    <div className={"w-full"}>
                        <CustomButton color={"primary"} className={"w-full mt-4"} onClickLoading={() => {
                            return axios.post(`/api/admin/positions/${position.identifier}/update/description`, {
                                description,
                            });
                        }}>Save</CustomButton>
                    </div>
                </CardBody>
            </Card>
            <div className={"grid grid-cols-1 md:grid-cols-8"}>
                <SettingCard title={"Identifier"} position={position} fieldName={"identifier"} callback={(result) => {router.push(`/admin/positions/${result}`);}}/>
                <SettingCard title={"Title"} position={position} fieldName={"title"} />
                <SettingCard title={"Short Description"} position={position} fieldName={"shortDescription"} />
                <SettingCard title={"Link"} position={position} fieldName={"link"} inputType={"url"} />
                <Card className="col-span-2 m-6 md:mr-3 sm:mb-3 h-fit">
                    <CardBody>
                        <h1 className="text-2xl font-bold text-center pb-2">{unlisted ? "Unlisted" : "Listed"}</h1>
                        <CustomButton color={"primary"} className={"w-full mt-4"} onClickLoading={() => {
                            return axios.post(`/api/admin/positions/${position.identifier}/update/unlisted`, {
                                unlisted: !unlisted,
                            }).then(() => {
                                setUnlisted(!unlisted);
                            });
                        }}>{unlisted ? "Set Listed" : "Set Unlisted"}</CustomButton>
                    </CardBody>
                </Card>
                <Card className="col-span-2 m-6 md:mr-3 sm:mb-3 h-fit">
                    <CardBody>
                        <h1 className="text-2xl font-bold text-center pb-2">{hidden ? "Hidden" : "Accessible"}</h1>
                        <CustomButton color={"primary"} className={"w-full mt-4"} onClickLoading={() => {
                            return axios.post(`/api/admin/positions/${position.identifier}/update/hidden`, {
                                hidden: !hidden,
                            }).then(() => {
                                setHidden(!hidden);
                            });
                        }}>{hidden ? "Unhide" : "Hide"}</CustomButton>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default EditPositionPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const position = await getPositionByIdentifier(context.query.id as string);
    if (!position) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            position,
        },
    };
}
