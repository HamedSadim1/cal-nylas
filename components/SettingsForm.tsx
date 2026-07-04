"use client";

import { useActionState, useState } from "react";
import { SettingsAction } from "@/lib/actions/action";
import { aboutSettingsSchema } from "@/lib/validations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/IconInput";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "./SubmitButton";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Mail, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface iAppProps {
  fullName: string;
  email: string;
  profileImage: string;
}

export function SettingsForm({ fullName, email, profileImage }: iAppProps) {
  const [lastResult, action] = useActionState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: aboutSettingsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
          <Settings className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Account settings
        </CardTitle>
        <CardDescription>
          Manage your profile information and preferences
        </CardDescription>
      </CardHeader>

      <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="flex flex-col gap-y-5 pt-2">
          {/* Full Name */}
          <div className="grid gap-y-2">
            <Label className="text-sm font-medium">Full Name</Label>
            <IconInput
              icon={User}
              name={fields.fullName.name}
              key={fields.fullName.key}
              defaultValue={fullName}
              placeholder="Hamed Sadim"
            />
            {fields.fullName.errors && (
              <p className="text-destructive text-sm">
                {fields.fullName.errors}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <IconInput
              icon={Mail}
              disabled
              defaultValue={email}
              placeholder="hamed@example.com"
              className="bg-muted/50"
            />
          </div>

          {/* Profile Image */}
          <div className="grid gap-y-2">
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            <Label className="text-sm font-medium">Profile Image</Label>
            {currentProfileImage ? (
              <div className="relative size-20">
                <Image
                  src={currentProfileImage}
                  alt="Profile"
                  width={300}
                  height={300}
                  className="rounded-xl size-20 object-cover ring-1 ring-border"
                />
                <Button
                  type="button"
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2.5 -right-2.5 size-6 rounded-full shadow-md"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  container:
                    "border-dashed border-border/60 rounded-xl hover:border-primary/30 transition-colors",
                }}
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profile image uploaded");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
              />
            )}
            {fields.profileImage.errors && (
              <p className="text-destructive text-sm">
                {fields.profileImage.errors}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-6">
          <SubmitButton text="Save Changes" className="w-full" />
        </CardFooter>
      </form>
    </Card>
  );
}
