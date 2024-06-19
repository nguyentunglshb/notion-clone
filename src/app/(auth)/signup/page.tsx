"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "@/components/global/Loader";
import Logo from "@/../public/cypresslogo.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { FormSchema } from "@/models/auth";
import { actionSignUpUser } from "@/actions/auth-actions";

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
    const [isPending, startTransition] = useTransition();

    const codeExchangeError = useMemo(() => {
        if (!searchParams) return "";
        return searchParams.get("error_description");
    }, [searchParams]);

    const confirmationAndErrorStyles = useMemo(
        () =>
            clsx("", {
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

    const onSubmit = async ({
        email,
        password,
    }: z.infer<typeof FormSchema>) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            const { error } = await actionSignUpUser(formData);
            if (error) {
                setSubmitError(error.message);
                form.reset();
                return;
            }
        });
        setConfirmation(true);
    };

    return (
        <>
            <Form {...form}>
                <form
                    // onChange={() => {
                    //     if (submitError) setSubmitError("");
                    // }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex w-full flex-col space-y-6 sm:w-[400px] sm:justify-center"
                >
                    <Link
                        href="/"
                        className="justify-left flex w-full items-center"
                    >
                        <Image
                            src={Logo}
                            alt="cypress Logo"
                            width={50}
                            height={50}
                        />
                        <span className="text-4xl font-semibold first-letter:ml-2 dark:text-white">
                            cypress.
                        </span>
                    </Link>
                    <FormDescription className="text-foreground/60">
                        An all-In-One Collaboration and Productivity Platform
                    </FormDescription>
                    {!confirmation && !codeExchangeError && (
                        <>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirm Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary">
                            Login
                        </Link>
                    </span>
                    {(confirmation || codeExchangeError) && (
                        <>
                            <Alert className={confirmationAndErrorStyles}>
                                {!codeExchangeError && (
                                    <MailCheck className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {codeExchangeError
                                        ? "Invalid Link"
                                        : "Check your email."}
                                </AlertTitle>
                                <AlertDescription>
                                    {codeExchangeError ||
                                        "An email confirmation has been sent."}
                                </AlertDescription>
                            </Alert>
                        </>
                    )}
                </form>
            </Form>
        </>
    );
}

export default SignUp;
