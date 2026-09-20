import { getUser } from "@/lib/data";
import { ClientHeader } from "./client-header";

export async function SiteHeader() {
  const user = await getUser();
  return <ClientHeader user={user} />;
}
