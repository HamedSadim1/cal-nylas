import { z } from "zod";
import { conformZodMessage } from "@conform-to/zod";
import { VALIDATION } from "@/lib/constants";

export function onboardingSchema(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    username: z
      .string()
      .min(VALIDATION.USERNAME_MIN)
      .max(VALIDATION.USERNAME_MAX)
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username must contain only letters, numbers, and hyphens",
      })
      // Pipe the schema so it runs only if the email is valid
      .pipe(
        // Note: The callback cannot be async here
        // As we run zod validation synchronously on the client
        z.string().superRefine((_, ctx) => {
          // This makes Conform to fallback to server validation
          // by indicating that the validation is not defined
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          // If it reaches here, then it must be validating on the server
          // Return the result as a promise so Zod knows it's async instead
          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already used",
              });
            }
          });
        })
      ),
    fullName: z.string().min(VALIDATION.NAME_MIN).max(VALIDATION.NAME_MAX),
  });
}

export const onboardingSchemaLocale = z.object({
  username: z
    .string()
    .min(VALIDATION.USERNAME_MIN)
    .max(VALIDATION.USERNAME_MAX)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username must contain only letters, numbers, and hyphens",
    }),
  fullName: z.string().min(VALIDATION.NAME_MIN).max(VALIDATION.NAME_MAX),
});

export const aboutSettingsSchema = z.object({
  fullName: z.string().min(VALIDATION.NAME_MIN).max(VALIDATION.NAME_MAX),

  profileImage: z.string(),
});

export const eventTypeSchema = z.object({
  title: z.string().min(VALIDATION.TITLE_MIN).max(VALIDATION.TITLE_MAX),
  duration: z.number().min(VALIDATION.DURATION_MIN).max(VALIDATION.DURATION_MAX),
  url: z.string().min(VALIDATION.URL_MIN).max(VALIDATION.URL_MAX),
  description: z.string().min(VALIDATION.DESCRIPTION_MIN).max(VALIDATION.DESCRIPTION_MAX),
  videoCallSoftware: z.string(),
});

export function EventTypeServerSchema(options?: {
  isUrlUnique: () => Promise<boolean>;
}) {
  return z.object({
    url: z
      .string()
      .min(VALIDATION.URL_MIN)
      .max(VALIDATION.URL_MAX)
      .pipe(
        // Note: The callback cannot be async here
        // As we run zod validation synchronously on the client
        z.string().superRefine((_, ctx) => {
          // This makes Conform to fallback to server validation
          // by indicating that the validation is not defined
          if (typeof options?.isUrlUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          // If it reaches here, then it must be validating on the server
          // Return the result as a promise so Zod knows it's async instead
          return options.isUrlUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Url is already used",
              });
            }
          });
        })
      ),
    title: z.string().min(VALIDATION.TITLE_MIN).max(VALIDATION.TITLE_MAX),
    duration: z.number().min(VALIDATION.DURATION_MIN).max(VALIDATION.DURATION_MAX),
    description: z.string().min(VALIDATION.DESCRIPTION_MIN).max(VALIDATION.DESCRIPTION_MAX),
    videoCallSoftware: z.string(),
  });
}
