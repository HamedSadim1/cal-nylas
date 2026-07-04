"use server";

import { auth } from "@/auth";
import prisma from "../db";
import { parseWithZod } from "@conform-to/zod";
import {
  aboutSettingsSchema,
  EventTypeServerSchema,
  onboardingSchema,
} from "../validations";
import { getFormString } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "../nylas";
import {
  ROUTES,
  DAYS_OF_WEEK,
  DEFAULT_AVAILABILITY,
  NYLAS_CONFERENCING_PROVIDER,
} from "../constants";

/**
 * Handles the onboarding action by authenticating the user, validating the form data,
 * and updating the user's information in the database.
 *
 * @param prevState - The previous state of the application (unused in this function).
 * @param formData - The form data submitted by the user.
 * @returns The updated user data if the onboarding process is successful.
 * @throws Will throw an error if the user is not authenticated.
 */
export async function onboardingAction(prevState: unknown, formData: FormData) {
  // Authenticate the user and get their session
  const session = await auth();
  // Throw an error if the user is not authenticated
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // Validate the form data using Zod schema and custom async validation function for username uniqueness check
  const submission = await parseWithZod(formData, {
    schema: onboardingSchema({
      async isUsernameUnique() {
        const exisitngSubDirectory = await prisma.user.findUnique({
          where: {
            userName: getFormString(formData, "username"),
          },
        });
        return !exisitngSubDirectory;
      },
    }),

    async: true,
  });
  console.log(submission);
  // If the submission is not successful, return the submission object to the client
  if (submission.status !== "success") {
    return submission.reply();
  }
  // If the submission is successful, update the user's information in the database and redirect the user to the home page
  const OnboardingData = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      userName: submission.value.username,
      name: submission.value.fullName,
      Availability: {
        createMany: {
          data: DAYS_OF_WEEK.map((day) => ({
            day,
            fromTime: DEFAULT_AVAILABILITY.FROM_TIME,
            tillTime: DEFAULT_AVAILABILITY.TILL_TIME,
          })),
        },
      },
    },
  });
  console.log(OnboardingData);

  redirect(ROUTES.ONBOARDING_GRANT_ID);
}

export async function SettingsAction(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const submission = parseWithZod(formData, {
    schema: aboutSettingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      userName: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });
  console.log("🚀 ~ SettingsAction ~ user:", user);

  return redirect(ROUTES.DASHBOARD);
}

/**
 * Updates the availability of a user based on the provided form data.
 *
 * This function first authenticates the user. If the user is not authenticated,
 * it throws an error. It then processes the form data to extract availability
 * information and updates the corresponding records in the database using a
 * transaction. After successfully updating the records, it revalidates the
 * availability path and redirects to the availability dashboard.
 *
 * @param {FormData} formData - The form data containing availability information.
 * @throws {Error} If the user is not authenticated.
 * @returns {Promise<void>} A promise that resolves when the availability is updated and the user is redirected.
 */
export async function updateAvailabilityAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  // Process the form data to extract availability information and update the database records
  const rawData = Object.fromEntries(formData.entries());
  // Extract availability data from the form data
  const availabilityData = Object.keys(rawData)
    // Filter out keys that do not start with "id-"
    .filter((key) => key.startsWith("id-"))
    // Map the filtered keys to an array of availability objects with id, isActive, fromTime, and tillTime properties
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: String(rawData[`fromTime-${id}`]),
        tillTime: String(rawData[`tillTime-${id}`]),
      };
    });

  try {
    // Update the availability records in the database using a transaction and revalidate the availability path
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath(ROUTES.DASHBOARD_AVAILABILITY);
    // return { status: "success", message: "Availability updated successfully" };
    // return redirect("/dashboard/availability");
  } catch (error) {
    console.error("Error updating availability:", error);
    // return { status: "error", message: "Failed to update availability" };
  }
}

/**
 * Updates the status of an event type.
 *
 * @param prevState - The previous state (not used in the function).
 * @param params - An object containing the event type ID and the new status.
 * @param params.eventTypeId - The ID of the event type to update.
 * @param params.isChecked - The new status of the event type (true for active, false for inactive).
 * @returns An object containing the status and message of the operation.
 *
 * @throws Will throw an error if the update operation fails.
 */
export async function updateEventTypeStatusAction(
  prevState: unknown,
  {
    eventTypeId,
    isChecked,
  }: {
    eventTypeId: string;
    isChecked: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Update the status of the event type in the database based on the provided event type ID and status
    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: userId,
      },
      data: {
        active: isChecked,
      },
    });

    console.log("updated event type:", data);

    revalidatePath(ROUTES.DASHBOARD);
    return {
      status: "success",
      message: "EventType Status updated successfully",
    };
  } catch (error) {
    console.error("Error updating event type status:", error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export async function createMeetingAction(formData: FormData) {
  // console.log("🚀 ~ createMeetingAction ~ formData:", formData);

  const getUserData = await prisma.user.findUnique({
    where: {
      userName: getFormString(formData, "userName"),
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  if (!getUserData.grantId || !getUserData.grantEmail) {
    throw new Error("User has not connected their calendar");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: getFormString(formData, "eventTypeId"),
    },
    select: {
      title: true,
      description: true,
    },
  });

  const formTime = getFormString(formData, "fromTime");
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = getFormString(formData, "eventDate");

  const startDateTime = new Date(`${eventDate}T${formTime}:00`);

  // Calculate the end time by adding the meeting length (in minutes) to the start time
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  await nylas.events.create({
    identifier: getUserData.grantId,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: NYLAS_CONFERENCING_PROVIDER,
      },
      participants: [
        {
          name: getFormString(formData, "name"),
          email: getFormString(formData, "email"),
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail,
      notifyParticipants: true,
    },
  });

  return redirect(ROUTES.SUCCESS);
}

export async function CreateEventTypeAction(
  prevState: unknown,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: userId,
            url: getFormString(formData, "url"),
          },
        });
        return !data;
      },
    }),

    async: true,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      userId: userId,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });
  console.log("🚀 ~ data:", data);

  return redirect(ROUTES.DASHBOARD);
}
