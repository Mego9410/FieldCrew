import { createClient } from "@/lib/supabase/server";
import { resolveWorkerToken } from "@/lib/workerToken";
import { getWorkerByInviteToken } from "@/lib/data";
import { InvalidTokenScreen } from "./InvalidTokenScreen";
import { WorkerHeader } from "./WorkerHeader";

export default async function WorkerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const result = await resolveWorkerToken(token, supabase);

  if (!result.valid) {
    return <InvalidTokenScreen />;
  }

  const worker = await getWorkerByInviteToken(token, supabase);
  const workerName = worker?.name ?? null;

  return (
    <div className="min-h-screen bg-fc-page">
      <WorkerHeader token={token} workerName={workerName} />
      <main>{children}</main>
    </div>
  );
}
