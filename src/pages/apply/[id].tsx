import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";

const ViewFormPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return (
        <></>
    );
};

export default ViewFormPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.query;

    return {
        props: {},
    };
}
