import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const AdminPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <div className={"mt-16"}>
        <h1 className={"text-4xl font-bold text-center"}>Admin</h1>
        <p className={"text-2xl text-gray-400 text-center pt-4"}>
            Welcome to the admin panel.
        </p>
        <div className={"flex h-screen justify-center items-center flex-col"}>

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
