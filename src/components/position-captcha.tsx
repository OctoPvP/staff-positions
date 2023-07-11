import React, {useEffect} from 'react';
import {Position} from "@prisma/client";
import CaptchaWidget from "@/components/captcha";
import {Spinner} from "@nextui-org/react";
import axios from "axios";
import {useRouter} from "next/router";

type PositionCaptchaProps = {
    data: Position;
}
const PositionCaptcha = ({data}: PositionCaptchaProps) => {
    const [completed, setCompleted] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const router = useRouter();
    useEffect(() => {
        if (completed) {
            axios.post(`/api/positions/${data.identifier}/link`, {
                [process.env.NEXT_PUBLIC_CAPTCHA_PARAM_NAME as string]: window.captchaToken,
            }).then((res) => {
                const { data } = res;
                const link = data.link as string;
                const embed = data.embedPage as boolean;
                if (embed) {
                    router.push(`/apply/${data.identifier}`);
                } else {
                    router.push(link);
                }
            }).catch((err) => {
                console.error(err);
                setError(err.response.data.message);
            });
        }
    }, [completed])
    return (
        <>
            <span>Please solve this captcha to continue.</span>
            {error && (
                <span className={"text-red-500"}>{error}</span>
            )}
            {completed ? (
                <Spinner />
            ) : (
                <CaptchaWidget flexCenter onVerify={(token) => {
                    setCompleted(true);
                }} />
            )}
        </>
    );
};

export default PositionCaptcha;