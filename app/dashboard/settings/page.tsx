import { SettingsForm } from "@/components/SettingsForm";
import { auth } from "@/auth";
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
  const session = await auth();
  if (!session?.user?.id) return notFound();
  const data = await getData(session.user.id);

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingsForm
        email={data.email}
        fullName={data.userName ?? ""}
        profileImage={data.image ?? ""}
      />
    </div>
  );
};

export default SettingsPage;
