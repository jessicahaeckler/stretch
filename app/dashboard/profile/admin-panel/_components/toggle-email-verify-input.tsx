"use client";

import { users } from "@/drizzle/schema";
import { toggleEmailVerifiedAction } from "@/actions/admin/toggle-email-verified-action";
import { useTransition } from "react";
type ToggleEmailVerifyInputProps = {
  email: (typeof users.$inferSelect)["email"];
  emailVerified: (typeof users.$inferSelect)["emailVerified"];
  isAdmin: boolean;
};

export default function ToggleEmailVerifiedInput({
  email,
  emailVerified,
  isAdmin,
}: ToggleEmailVerifyInputProps) {
  const [isPending, startTransition] = useTransition();
  const clickHandler = async (
    email: string | null,
    isCurrentlyVerified: boolean,
  ) => {
    startTransition(async () => {
      await toggleEmailVerifiedAction(email, isCurrentlyVerified);
    });
  };
  return (
    <div className="flex items-center justify-center">
      <input
        disabled={isAdmin || isPending}
        type="checkbox"
        checked={!!emailVerified}
        className="scale-150 enabled:cursor-pointer disabled:opacity-50"
        readOnly
        onClick={clickHandler.bind(null, email, !!emailVerified)}
      />
    </div>
  );
}
