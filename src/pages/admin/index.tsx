import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import useSWR, {mutate} from "swr";
import {Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {FaPlus, FaTrash} from "react-icons/fa6";
import {FaEdit} from "react-icons/fa";
import NextLink from "next/link";
import {useDynamicModal} from "@/components/dynamic-modal";
import {Button as NextUIButton} from "@nextui-org/button";
import CustomButton from "@/components/button";
import axios from "axios";
import {Input} from "@nextui-org/input";

const AdminPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const { showModal, closeModal } = useDynamicModal();
    const {data, error, isLoading} = useSWR('/api/admin/positions/list')
    return (
        <div className={"mt-16"}>
            <h1 className={"text-4xl font-bold text-center"}>Admin</h1>
            <p className={"text-2xl text-gray-400 text-center pt-4"}>
                Welcome to the admin panel.
            </p>
            <div className={"w-full flex justify-center mt-10"}>
                <div className={"w-[75%]"}>
                    <Button color={"primary"} className={"md:float-right md:right-4 md:top-14 md:z-10 md:mb-0 md:w-fit w-full mb-4"}
                            onPress={() => {
                                showModal({
                                    title: "Add a position",
                                    body: (
                                        <>
                                            <span className={"text-gray-400 text-sm"}>Will be unlisted.</span>
                                            <Input
                                                autoFocus
                                                label={"Identifier"}
                                                id={"identifier"}
                                                placeholder={"developer"}
                                                variant={"bordered"}
                                            />
                                            <Input
                                                label={"Title"}
                                                placeholder={"Developer"}
                                                variant={"bordered"}
                                                id={"title"}
                                            />
                                            <Input
                                                label={"Link"}
                                                placeholder={"https://form.com/abc"}
                                                type={"url"}
                                                variant={"bordered"}
                                                id={"link"}
                                            />
                                            <Input
                                                label={"Short Description"}
                                                placeholder={"A short description of the position."}
                                                variant={"bordered"}
                                                id={"shortDescription"}
                                            />
                                        </>
                                    ),
                                    footer: (
                                        <>
                                            <NextUIButton
                                                color={"default"}
                                                onPress={closeModal}
                                            >
                                                Cancel
                                            </NextUIButton>
                                            <CustomButton
                                                color={"primary"}
                                                closeModal={closeModal}
                                                onClickLoading={() => {
                                                    const identifier = (document.getElementById("identifier") as HTMLInputElement).value;
                                                    const title = (document.getElementById("title") as HTMLInputElement).value;
                                                    const link = (document.getElementById("link") as HTMLInputElement).value;
                                                    const shortDescription = (document.getElementById("shortDescription") as HTMLInputElement).value;

                                                    return axios.post('/api/admin/positions/create', {
                                                        identifier,
                                                        title,
                                                        link,
                                                        shortDescription
                                                    }).then(() => {
                                                        // trigger swr to revalidate
                                                        return mutate('/api/admin/positions/list');
                                                    });
                                                }}
                                            >
                                                Create
                                            </CustomButton>
                                        </>
                                    )
                                });
                            }}
                    ><FaPlus /> Create</Button>
                    <Table>
                        <TableHeader>
                            <TableColumn>Identifier</TableColumn>
                            <TableColumn>Title</TableColumn>
                            <TableColumn>Created</TableColumn>
                            <TableColumn>Last Modified</TableColumn>
                            <TableColumn>Unlisted</TableColumn>
                            <TableColumn>Hidden</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((position: any, i: number) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{position.identifier}</TableCell>
                                        <TableCell>{position.title}</TableCell>
                                        <TableCell>{new Date(position.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(position.updatedAt).toLocaleString()}</TableCell>
                                        <TableCell>{position.unlisted ? "Yes" : "No"}</TableCell>
                                        <TableCell>{position.hidden ? "Yes" : "No"}</TableCell>
                                        <TableCell>
                                            <NextLink href={`/admin/positions/${position.identifier}`} className={"outline-0"}>
                                                <Button color={"primary"} className={"mr-4"}><FaEdit/> Edit</Button>
                                            </NextLink>
                                            <Button color={"danger"} onPress={() => {
                                                showModal({
                                                    title: "Are you sure?",
                                                    body: "Are you sure you want to delete this position? This action cannot be undone.",
                                                    footer: (
                                                        <>
                                                            <NextUIButton
                                                                color={"default"}
                                                                onPress={closeModal}
                                                            >
                                                                No
                                                            </NextUIButton>
                                                            <CustomButton
                                                                color={"danger"}
                                                                closeModal={closeModal}
                                                                onClickLoading={() => {
                                                                    return axios.delete(`/api/admin/positions/${position.identifier}/remove`).then(() => {
                                                                        // trigger swr to revalidate
                                                                        return mutate('/api/admin/positions/list')
                                                                    })
                                                                }}
                                                            >
                                                                Yes
                                                            </CustomButton>
                                                        </>
                                                    ),
                                                });
                                            }}><FaTrash/> Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {},
    };
}
