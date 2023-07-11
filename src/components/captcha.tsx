import React, {useEffect} from 'react';

type CaptchaWidgetProps = {
    id?: string;
    autoRender?: boolean;
    onVerify?: (token: string) => void;

    className?: string;
    flexCenter?: boolean;

    dummy?: any; // dummy prop to force re-render
}
const CaptchaWidget = ({id, autoRender = true, className,
                        flexCenter = false, onVerify, dummy
                       }: CaptchaWidgetProps) => {
    function getId() {
        return id || "captcha";
    }

    useEffect(() => {
        // run on client side
        async function render() {
            if (!autoRender) return;
            console.log(
                "Initializing captcha... Note that logs about only one captcha being rendered are normal."
            );
            try {
                // @ts-ignore
                window[process.env.NEXT_PUBLIC_CAPTCHA_JS_WINDOW_NAME as string].render(document.getElementById(getId()), {
                    sitekey: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string,
                });
            } catch (e) {
                console.error("Error rendering captcha", e);
                setTimeout(() => {
                    console.log("Retrying captcha...");
                    render();
                }, 1000);
            }
        }

        render();
    }, [dummy]);

    useEffect(() => {
        function onCaptchaVerify(token: string) {
            window.captchaToken = token;
            if (onVerify) onVerify(token);
        }
        // @ts-ignore
        window.onCaptchaVerify = onCaptchaVerify;
    }, [])

    return (
        <div
            id={getId()}
            data-sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
            data-theme={"dark"}
            data-callback={"onCaptchaVerify"}
            className={className + (flexCenter ? " flex justify-center" : "") + " bg-transparent"}
        >
            {" "}
        </div>
    );
};

export default CaptchaWidget;