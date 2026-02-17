import { UsersOnly } from "@/components/features/auth/auth-guards";

async function Page({ params }: PageProps<"/executions/[executionId]">) {
  const { executionId } = await params;
  return (
    <UsersOnly>
      <div>executions: {executionId}</div>
    </UsersOnly>
  );
}

export default Page;
