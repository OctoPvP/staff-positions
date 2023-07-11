import React from "react";

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import CaptchaWidget from "@/components/captcha";
import {Button} from "@nextui-org/react";
import axios from "axios";
import CustomButton from "@/components/button";

const CaptchaPage = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return (
        <div className={"mt-16"}>
            <CaptchaWidget onVerify={() => {
                console.log("Verified!");
            }}/>
            <CustomButton color={"primary"} onClickLoading={() => {
                return axios.post("/api/captcha/test", {
                    "h-captcha-response": window.captchaToken
                })
            }}>Submit</CustomButton>
        </div>
    );
};

export default CaptchaPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {},
    };
}
