import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
    </div>
  );
}
