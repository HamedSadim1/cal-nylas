import { SettingsForm } from "@/components/SettingsForm";
import { requireUser } from "@/lib/auth";
import { PageContainer } from "@/components/PageContainer";
import { ROUTES } from "@/lib/constants";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: { id },
    select: {
      userName: true,
      email: true,
      image: true,
    },
  });

  if (!data) return notFound();
  return data;
}

const SettingsPage = async () => {
  const session = await requireUser({ redirectTo: ROUTES.HOME });
  const data = await getData(session.user.id);

  return (
    <PageContainer>
      <SettingsForm
        email={data.email}
        fullName={data.userName ?? ""}
        profileImage={data.image ?? ""}
      />
    </PageContainer>
  );
};

export default SettingsPage;
