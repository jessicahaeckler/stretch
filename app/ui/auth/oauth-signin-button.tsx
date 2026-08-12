"use client";

import { Button } from "@/components/ui/button";
import { SiGithub, SiGithubHex } from "@icons-pack/react-simple-icons";
import googleLogo from "@/public/google.png";
import Image from "next/image";

type OAuthSigninButtonsProps = {
  signup: boolean;
};

export const OAuthSigninButtons = ({ signup }: OAuthSigninButtonsProps) => {
  const text = signup ? "Sign up" : "Sign in";
  const clickHandler = () => {};
  return (
    <div className="max-w-[400px]">
      <Button variant="secondary" className="w-full" onClick={clickHandler}>
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
        onClick={clickHandler}
      >
        <SiGithub color={SiGithubHex} className="mr-2" />
        {text} with Github
      </Button>
    </div>
  );
};
