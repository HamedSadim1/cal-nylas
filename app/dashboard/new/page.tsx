"use client";

import { CreateEventTypeAction } from "@/lib/actions/action";
import { SubmitButton } from "@/components/SubmitButton";
import { eventTypeSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import React, { useState, useActionState } from "react";
import {
  ArrowLeft,
  CalendarPlus,
  Clock,
  FileText,
  Globe,
  Video,
} from "lucide-react";

type Platform = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

const PLATFORMS: { label: string; value: Platform }[] = [
  { label: "Zoom", value: "Zoom Meeting" },
  { label: "Google Meet", value: "Google Meet" },
  { label: "Teams", value: "Microsoft Teams" },
];

const CreateNewEvent = () => {
  const [lastResult, action] = useActionState(CreateEventTypeAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [activePlatform, setActivePlatform] = useState<Platform>("Google Meet");

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        Back to event types
      </Link>

      <Card className="border-border/60 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <CalendarPlus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create event type
          </CardTitle>
          <CardDescription>
            Set up a new appointment type for people to book time with you
          </CardDescription>
        </CardHeader>

        <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent className="grid gap-y-5 pt-2">
            {/* Title */}
            <div className="grid gap-y-2">
              <Label className="text-sm font-medium">Title</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  name={fields.title.name}
                  key={fields.title.key}
                  defaultValue={fields.title.initialValue}
                  placeholder="30 min consultation"
                  className="pl-9"
                />
              </div>
              {fields.title.errors && (
                <p className="text-destructive text-sm">
                  {fields.title.errors}
                </p>
              )}
            </div>

            {/* URL Slug */}
            <div className="grid gap-y-2">
              <Label className="text-sm font-medium">URL Slug</Label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm gap-1">
                  <Globe className="size-3.5" />
                  CalHamed.com/
                </span>
                <Input
                  type="text"
                  key={fields.url.key}
                  defaultValue={fields.url.initialValue}
                  name={fields.url.name}
                  placeholder="30min-consult"
                  className="rounded-l-none"
                />
              </div>
              {fields.url.errors && (
                <p className="text-destructive text-sm">{fields.url.errors}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                  placeholder="A quick catch-up call to discuss your project needs"
                  className="pl-9 min-h-20 resize-none"
                />
              </div>
              {fields.description.errors && (
                <p className="text-destructive text-sm">
                  {fields.description.errors}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="grid gap-y-2">
              <Label className="text-sm font-medium">Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={fields.duration.initialValue}
              >
                <SelectTrigger className="[&>svg]:text-muted-foreground">
                  <Clock className="size-4 text-muted-foreground mr-2" />
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fields.duration.errors && (
                <p className="text-destructive text-sm">
                  {fields.duration.errors}
                </p>
              )}
            </div>

            {/* Video Call Provider */}
            <div className="grid gap-y-2">
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                value={activePlatform}
              />
              <Label className="text-sm font-medium">Video Call Provider</Label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(({ label, value }) => {
                  const isActive = activePlatform === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActivePlatform(value)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Video className="size-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-3 border-t border-border pt-6">
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                <ArrowLeft className="size-4 mr-1.5" />
                Cancel
              </Link>
            </Button>
            <SubmitButton text="Create Event Type" className="px-6" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateNewEvent;
