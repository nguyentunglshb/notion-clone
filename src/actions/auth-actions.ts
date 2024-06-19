"use server";

import { createClient } from "@/lib/supabase/server";
import { FormSchema } from "@/models/auth";
import { z } from "zod";

export async function actionLoginUser({
    email,
    password,
}: z.infer<typeof FormSchema>) {
    const supabase = createClient();

    const response = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return response;
}

export async function actionSignUpUser(body: FormData) {
    const formData = Object.fromEntries(body);
    const parsed = FormSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            error: {
                message: "Invalid data",
            },
        };
    }

    const supabase = createClient();

    const { email, password } = parsed.data;

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email);

    if (data?.length)
        return { error: { message: "User already exists", data } };
    const response = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
        },
    });
    return response;
}
