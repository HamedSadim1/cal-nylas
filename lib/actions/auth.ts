"use server";

import { signIn } from "@/auth";

export async function signInGoogle() {
  await signIn("google");
}

export async function signInGithub() {
  await signIn("github");
}
