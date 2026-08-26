"use client";

import { Controller, useForm } from "react-hook-form";
import { signInSchema } from "@/resources/auth/schemas/signin-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signinUserAction } from "@/resources/auth/actions/signin-user-action";
import { OAuthSigninButtons } from "./oauth-signin-button";
import { ForgotPasswordForm } from "@/app/auth/sign-in/_components/forgot-password-form";

export default function SigninForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const form = useForm<z.input<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;
  const submit = async (values: z.input<typeof signInSchema>) => {
    const res = await signinUserAction(values, callbackUrl);

    if (!res.success) {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error });
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
      }
    }
  };
  return (
    <Card className="bg-gray-50 pt-8">
      <form
        id="sign-in"
        onSubmit={handleSubmit(submit)}
        className="space-y-8 max-w-[400px]"
      >
        <CardHeader>
          <CardTitle>Please sign in to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    type="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button
                className="w-full"
                type="submit"
                disabled={formState.isSubmitting}
                form="sign-in"
              >
                Sign in
              </Button>
            </Field>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <OAuthSigninButtons signup={false} />
          </FieldGroup>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col justify items-start!">
        <div className="flex gap-1 text-sm mb-[5px] mt-[15px]">
          <p className="hidden md:block">Don&apos;t have an account?</p>
          <Link
            key="create-account"
            href="/auth/sign-up"
            className="underline flex h-[20px] grow items-center justify-center gap-2 rounded-md font-medium hover:text-blue-600 md:flex-none md:justify-start"
          >
            Sign up
          </Link>
        </div>
        <div>
          <ForgotPasswordForm />
        </div>
      </CardFooter>
    </Card>
  );
}

export const SigninFormSkeleton = () => {
  return (
    <Card className="bg-gray-50 pt-8">
      <form id="sign-in" className="space-y-8 max-w-[400px]">
        <CardHeader>
          <CardTitle>Please sign in to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
          </FieldGroup>
        </CardContent>
      </form>
      <CardFooter>
        <div className="h-10 w-full rounded-md bg-gray-200" />
      </CardFooter>
    </Card>
  );
};
