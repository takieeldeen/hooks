import { UsersOnly } from "@/features/auth/auth-guards";

async function Page({ params }: PageProps<"/workflows/[workflowId]">) {
  const { workflowId } = await params;
  return (
    <UsersOnly>
      <div>workflows: {workflowId}</div>
    </UsersOnly>
  );
}

export default Page;
