import { SettingsForm } from "@/components/SettingsForm";
import { auth } from "@/auth";

import prisma from "@/lib/db";

import { notFound } from "next/navigation";
import React from "react";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      userName: true,
      email: true,
      image: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const SettingsPage = async () => {
  const session = await auth();
  const data = await getData(session?.user?.id as string);
  return (
    <SettingsForm
      email={data.email}
      fullName={data.userName as string}
      profileImage={data.image as string}
    />
  );
};

export default SettingsPage;
