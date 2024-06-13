"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "@/components/global/Loader";
import Logo from "@/../public/cypresslogo.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";

const SignUpFormSchema = z
    .object({
        email: z.string().describe("Email").email({
            message: "Invalid Email",
        }),
        password: z
            .string()
            .describe("Password")
            .min(6, "Password must be minimum 6 characters"),
        confirmPassword: z
            .string()
            .describe("Confirm Password")
            .min(6, "Password must be minimum 6 characters"),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Password doesn't match",
        path: ["confirmPassword"],
    });

function SignUp() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState("");
    const [confirmation, setConfirmation] = useState(false);

    const codeExchangeError = useMemo(() => {
        if (!searchParams) return "";
        return searchParams.get("error_description");
    }, [searchParams]);

    const confirmationAndErrorStyles = useMemo(
        () =>
            clsx("bg-primary", {
                "bg-red-500/10": codeExchangeError,
                "border-red-500/50": codeExchangeError,
                "text-red-700": codeExchangeError,
            }),
        [codeExchangeError]
    );

    const form = useForm<z.infer<typeof SignUpFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = () => {};

    const signUpHandler = () => {};

    return (
        <Form {...form}>
            <form
                onChange={() => {
                    if (submitError) setSubmitError("");
                }}
                onSubmit={form.handleSubmit(onSubmit)}
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

                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    autoComplete="password"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                ></FormField>

                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    autoComplete="password"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                ></FormField>

                {!confirmation && !codeExchangeError && (
                    <>
                        <Button
                            type="submit"
                            className="w-full p-6"
                            disabled={isLoading}
                        >
                            {!isLoading ? "Create Account" : <Loader />}
                        </Button>
                    </>
                )}

                {submitError && <FormMessage>{submitError}</FormMessage>}
                <span className="self-container">
                    Already have an account?
                    <Link href="/login" className="text-primary-foreground">
                        Login
                    </Link>
                </span>
                {(confirmation || codeExchangeError) && (
                    <>
                        <Alert className={confirmationAndErrorStyles}>
                            {!codeExchangeError && (
                                <MailCheck className="size-4" />
                            )}
                            <AlertTitle>
                                {codeExchangeError
                                    ? "Invalid Link"
                                    : "Check your email"}
                            </AlertTitle>
                            <AlertDescription>
                                {codeExchangeError ||
                                    "An email confirmation has been sent"}
                            </AlertDescription>
                        </Alert>
                    </>
                )}
            </form>
        </Form>
    );
}

export default SignUp;
