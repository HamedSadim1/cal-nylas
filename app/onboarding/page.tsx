"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchemaLocale } from "@/lib/validations";
import { useForm } from "@conform-to/react";
import { onboardingAction } from "@/lib/actions/action";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { ArrowLeft, User, AtSign } from "lucide-react";
import { APP_BRAND_SHORT, APP_URL, getFooterText, ROUTES } from "@/lib/constants";

const OnboardingPage = () => {
  const [lastResult, action] = useActionState(onboardingAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: onboardingSchemaLocale });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src={Logo}
                className="relative size-8 transition-transform duration-300 group-hover:scale-110"
                alt="Logo"
              />
            </div>
            <h4 className="text-xl font-bold tracking-tight">
              Cal<span className="text-primary">{APP_BRAND_SHORT}</span>
            </h4>
          </Link>
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Progress indicator */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </span>
              <div className="h-0.5 flex-1 bg-border rounded-full" />
              <span className="flex items-center justify-center size-8 rounded-full bg-muted text-muted-foreground text-sm font-bold">
                2
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Step 1 of 2 — Create your profile
            </p>
          </div>

          {/* Form card */}
          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 [animation-fill-mode:both] border-border/60 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <User className="size-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Set up your profile
              </CardTitle>
              <CardDescription>
                We need a few details to personalize your scheduling experience
              </CardDescription>
            </CardHeader>

            <form
              id={form.id}
              onSubmit={form.onSubmit}
              action={action}
              noValidate
            >
              <CardContent className="flex flex-col gap-y-5 pt-2">
                {/* Full Name */}
                <div className="grid gap-y-2">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      name={fields.fullName.name}
                      defaultValue={fields.fullName.initialValue}
                      key={fields.fullName.key}
                      placeholder="Hamed Sadim"
                      className="pl-9"
                    />
                  </div>
                  {fields.fullName.errors && (
                    <p className="text-destructive text-sm">
                      {fields.fullName.errors}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="grid gap-y-2">
                  <Label className="text-sm font-medium">Username</Label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm gap-1">
                      <AtSign className="size-3.5" />
                      {APP_URL}/
                    </span>
                    <Input
                      type="text"
                      key={fields.username.key}
                      defaultValue={fields.username.initialValue}
                      name={fields.username.name}
                      placeholder="example-user-1"
                      className="rounded-l-none"
                    />
                  </div>
                  {fields.username.errors && (
                    <p className="text-destructive text-sm">
                      {fields.username.errors}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <SubmitButton className="w-full" text="Continue" />
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-muted-foreground">
        <p className="text-sm">{getFooterText()}</p>
      </footer>
    </div>
  );
};

export default OnboardingPage;
