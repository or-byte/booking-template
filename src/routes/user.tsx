import { Title } from "@solidjs/meta";
import { useSession } from "~/lib/auth";

export default function User() {
  const session = useSession();

  return (
    <main>
      <Title></Title>
      <h1>Hello, {session().data?.user.name || "Customer!"} </h1>
      </main>
  )
}