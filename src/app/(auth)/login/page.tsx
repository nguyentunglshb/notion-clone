"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/models/auth";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";

import Logo from "@/../public/cypresslogo.svg";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={() => {
                    if (submitError) setSubmitError(null);
                }}
                className="flex w-full flex-col space-y-6 sm:w-[400px] sm:justify-center"
            >
                <Link
                    href="/"
                    className="flex w-full items-center justify-start"
                >
                    <Image src={Logo} alt="logo" width={50} height={50} />
                </Link>
                <FormDescription>
                    An all-in-one collaboration and productivity platform
                </FormDescription>
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                ></FormField>
            </form>
        </Form>
    );
};

export default LoginPage;
