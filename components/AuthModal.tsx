import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Logo from "@/public/logo.png";
import Image from "next/image";

import { signInGithub, signInGoogle } from "@/lib/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { GitHubAuthButton, GoogleAuthButton } from "./SubmitButton";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="relative inline-flex overflow-hidden rounded-md">
          <Button className="relative group/trig">
            <span className="relative z-10">Try for Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 -translate-x-full group-hover/trig:translate-x-full transition-transform duration-700" />
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100 p-0 gap-0 overflow-hidden">
        {/* Branded Header */}
        <div className="relative px-6 pt-8 pb-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative">
            <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
              <Image src={Logo} className="size-8" alt="Logo" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight mb-1.5">
              Welcome to <span className="text-primary">{APP_NAME}</span>
            </DialogTitle>
            <DialogDescription>
              Sign in to manage your schedule and events
            </DialogDescription>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-3">
            <form className="w-full" action={signInGoogle}>
              <GoogleAuthButton />
            </form>
            <form className="w-full" action={signInGithub}>
              <GitHubAuthButton />
            </form>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
