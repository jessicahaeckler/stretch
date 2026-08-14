"use client";

import { Button } from "@/components/ui/button";
import { SiGithub, SiGithubHex } from "@icons-pack/react-simple-icons";
import googleLogo from "@/public/google.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { oauthSignInAction } from "@/actions/oauth-signin-action";

type OAuthSigninButtonsProps = {
  signup: boolean;
};

export const OAuthSigninButtons = ({ signup }: OAuthSigninButtonsProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const text = signup ? "Sign up" : "Sign in";
  const clickHandler = async (provider: "google" | "github") => {
    await oauthSignInAction(provider, callbackUrl);
  };
  return (
    <div className="max-w-[400px]">
      <Button
        variant="secondary"
        className="w-full"
        onClick={clickHandler.bind(null, "google")}
      >
        <Image
          src={googleLogo}
          alt="Google Logo"
          width={16}
          height={16}
          className="mr-2"
        />
        {text} with Google
      </Button>

      <Button
        variant="secondary"
        className="mt-2 w-full"
        onClick={clickHandler.bind(null, "github")}
      >
        <SiGithub color={SiGithubHex} className="mr-2" />
        {text} with Github
      </Button>
    </div>
  );
};
