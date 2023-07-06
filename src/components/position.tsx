import React from 'react';

import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Button, Divider} from "@nextui-org/react";
import {FaArrowRight} from "react-icons/fa6";
import NextLink from "next/link";

interface PositionProps {
    title: string;
    id: string;
    description: string;
}
const Position = (props: PositionProps) => {
    return (
        <div className={"md:w-[400px] w-full px-4"}>
            <Card className="w-full mt-4 md:w-auto">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col w-full">
                        <p className="text-2xl font-bold text-center">{props.title}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p>{props.description}</p>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <div className={"flex flex-col w-full px-4"}>
                        <NextLink
                            href={"/positions/" + encodeURIComponent(props.id.toLowerCase())}
                            className={"outline-0"}
                        >
                            <Button color={"primary"} className={"w-full"}>
                                Read More <FaArrowRight />
                            </Button>
                        </NextLink>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Position;