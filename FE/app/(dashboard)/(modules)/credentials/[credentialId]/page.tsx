import { UsersOnly } from "@/components/features/auth/auth-guards";

async function Page({ params }: PageProps<"/credentials/[credentialId]">) {
  const { credentialId } = await params;
  return (
    <UsersOnly>
      <div>Credentials: {credentialId}</div>
    </UsersOnly>
  );
}

export default Page;
