import { resolveWorkerToken } from "@/lib/workerToken";
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
  const result = await resolveWorkerToken(token);

  if (!result.valid) {
    return <InvalidTokenScreen />;
  }

  return (
    <div className="min-h-screen bg-fc-page">
      <WorkerHeader token={token} />
      <main>{children}</main>
    </div>
  );
}
