import React, {useEffect} from 'react';
import {Button as NextUIButton, ButtonProps} from "@nextui-org/react";
import {PressEvent} from "@react-types/shared";
import {useDynamicModal} from "@/components/dynamic-modal";
import {FaCheck} from "react-icons/fa6";
const CustomButton = ({ modalOnError = true, showSuccessColor = true, ...props }: {
    onClickLoading?: (
        e: PressEvent
    ) => Promise<any>;
    onClick?: (
        e: PressEvent
    ) => void;
    onPress?: (
        e: PressEvent
    ) => void;
    toggle?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    modalOnError?: boolean;
    showSuccessColor?: boolean;
    closeModal?: () => void;
} & React.ComponentProps<typeof NextUIButton>) => {
    const { showModal, closeModal } = useDynamicModal();
    const [loading, setLoading] = React.useState(false);
    const [successAnimation, setSuccessAnimation] = React.useState(false);
    const [btnColor, setBtnColor] = React.useState<ButtonProps["color"] | undefined>(props.color);
    useEffect(() => {
        setBtnColor(props.color)
    }, [props.color])
    const propsCopy = {...props};
    delete propsCopy.onClickLoading; // fix invalid event handler error
    delete propsCopy.color;
    delete propsCopy.closeModal;
    return (
        <>
            <NextUIButton color={btnColor} onPress={(e) => {
                if (props.onClickLoading) {
                    setLoading(true);
                    const promise = props.onClickLoading(e)
                    if (promise) {
                        promise.catch((e: any) => {
                            if (e.response) {
                                // if there is res.data.message, show it
                                if (e.response.data.message) {
                                    showModal({
                                        title: "Error",
                                        body: e.response.data.message,
                                        footer: (
                                            <NextUIButton
                                                color={"danger"}
                                                onPress={closeModal}
                                            >
                                                Close
                                            </NextUIButton>
                                        ),
                                    });
                                }
                            }
                        }).finally(() => {
                            setLoading(false);
                            if (showSuccessColor) {
                                const originalColor = props.color;
                                setBtnColor("success");
                                setSuccessAnimation(true)
                                setTimeout(() => {
                                    setBtnColor(originalColor);
                                    setSuccessAnimation(false);
                                    if (props.closeModal) {
                                        props.closeModal();
                                    }
                                }, 1000);
                            }
                        });
                    } else {
                        setLoading(false);
                    }
                } else if (props.onClick) {
                    props.onClick(e);
                } else if (props.onPress) {
                    props.onPress(e);
                } else if (props.toggle) {
                    props.toggle[1](!props.toggle[0]);
                }
            }} isLoading={loading} {...propsCopy}>
                {successAnimation && <FaCheck />}{props.children}
            </NextUIButton>
        </>
    );
};

export default CustomButton;