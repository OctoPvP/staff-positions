import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {
    Link,
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@nextui-org/react";
import NextLink from "next/link";
import Logo from "@public/logo.svg";
import clsx from "clsx";
import {link as linkStyles} from "@nextui-org/theme";
import Image from "next/image";

interface AppWrapperProps {
    children: React.ReactNode[] | React.ReactNode | null | undefined;
    title?: string;
}

const navItems = [
    {
        label: "Home",
        href: "/#home",
        alias: "/"
    },
    {
        label: "Positions",
        href: "/#positions",
    }
]
export const AppWrapper = ({children, title}: AppWrapperProps) => {
    const router = useRouter();
    return (
        <>
            <NextUINavbar maxWidth="xl" shouldHideOnScroll>
                <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                    <NavbarBrand className="gap-3 max-w-fit">
                        <NextLink className="flex justify-start items-center gap-1" href="/#home" scroll={false}>
                            <Image src={Logo} height={30} width={30} alt={"OctoMC Logo"} className={"rounded-md mr-2"}/>
                            <p className="font-bold text-inherit">OctoMC - Staff</p>
                        </NextLink>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
                    <div className="hidden lg:flex gap-4 justify-start ml-2">
                        {navItems.map((item) => {
                            /*
                            const isActive =
                                (router.asPath === item.href ||
                                    (item.href !== "/" && router.asPath.startsWith(item.href))) ||
                                (item.alias && router.asPath === item.alias);
                             */
                            return (
                                <NavbarItem key={item.href} isActive={/*isActive || */false}>
                                    <NextLink
                                        className={clsx(
                                            linkStyles({color: /*isActive*/ false ? "primary" : "foreground"}),
                                            "data-[active=true]:text-primary data-[active=true]:font-medium"
                                        )}
                                        color="foreground"
                                        href={item.href}
                                        scroll={false}
                                        id={"nav-link-" + item.label.toLowerCase()}
                                    >
                                        {item.label}
                                    </NextLink>
                                </NavbarItem>
                            )
                        })}
                    </div>
                    <NavbarMenuToggle className="sm:hidden"/>
                </NavbarContent>
                <NavbarMenu>
                    <div className="mx-4 mt-2 flex flex-col gap-2">
                        {navItems.map((item, index) => {
                            /*
                            const isActive =
                                (router.asPath === item.href ||
                                    (item.href !== "/" && router.asPath.startsWith(item.href))) ||
                                (item.alias && router.asPath === item.alias);
                             */
                            return (
                                <NavbarMenuItem key={`${item}-${index}`}>
                                    <Link
                                        color={
                                            /*isActive*/ false
                                                ? "primary"
                                                : "foreground"
                                        }
                                        href={item.href}
                                        size="lg"
                                    >
                                        {item.label}
                                    </Link>
                                </NavbarMenuItem>
                            )
                        })}
                    </div>
                </NavbarMenu>
            </NextUINavbar>
            <h1 className="text-4xl font-bold text-center">{title}</h1>
            {children}
        </>
    );
};