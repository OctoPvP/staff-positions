import {Button} from "@nextui-org/react";
import {FaArrowDown} from "react-icons/fa6";
import {useRouter} from "next/router";
import Position from "@/components/position";

export default function Home() {
    const router = useRouter();
    return (
        <>
            <section id={"home"}>
                <div className={"flex h-screen justify-center items-center flex-col"}>
                    <h1 className={"md:text-7xl text-5xl font-bold"}>Staff Positions</h1>
                    <Button className={"mt-4"} color={"primary"} onPress={() => {
                        // click the id nav-link-positions
                        document.getElementById("nav-link-positions")?.click();
                    }}>
                        Explore <FaArrowDown/>
                    </Button>
                </div>
            </section>
            {/* positions sections should not be on screen and must be scrolled down to */}
            <section id={"positions"} className={
                "flex flex-col justify-center items-center min-h-screen bg-background"
            }>
                <h2 className={"md:text-6xl text-4xl font-bold pb-8"}>Available Positions</h2>
                <div className={"mx-4"}>
                    <Position
                        title={"Developer"}
                        description={"Developers are responsible for creating and maintaining the server's plugins and website."}
                        id={"developer"}
                    />
                </div>
            </section>
        </>
    )
}
