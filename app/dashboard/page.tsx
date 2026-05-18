import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/data/links";
import { DashboardContent } from "./components/DashboardContent";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getUserLinks(userId);

  return <DashboardContent userLinks={userLinks} />;
}
