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
