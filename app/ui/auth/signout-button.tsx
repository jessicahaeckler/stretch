"use client";
import { signoutUserAction } from "@/actions/signout-user-action";
import { Button } from "@/components/ui/button";

export default function SignoutButton() {
  const clickHandler = async () => {
    await signoutUserAction();
  };
  return (
    <Button variant="destructive" size="lg" onClick={clickHandler}>
      Sign Out
    </Button>
  );
}
