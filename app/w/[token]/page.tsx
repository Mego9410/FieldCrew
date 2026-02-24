import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function WorkerRootPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(routes.worker.jobs(token));
}
