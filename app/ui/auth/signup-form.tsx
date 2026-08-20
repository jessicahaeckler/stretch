"use client";

import { Controller, useForm } from "react-hook-form";
import { signUpSchema } from "@/validators/signup-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import { useState } from "react";

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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupUserAction } from "@/actions/signup-user-action";
import { OAuthSigninButtons } from "./oauth-signin-button";

export default function SignupForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<z.input<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;
  const submit = async (values: z.input<typeof signUpSchema>) => {
    const res = await signupUserAction(values);

    if (res.success) {
      setSuccess(true);
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.fieldErrors;

          for (const key of Object.keys(nestedErrors) as Array<
            keyof typeof nestedErrors
          >) {
            setError(key, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 409:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("confirmPassword", { message: error });
      }
    }
  };

  if (success) {
    return (
      <div>
        <p> User successfully created!</p>

        <span>
          Click{" "}
          <Button variant="link" size="sm" className="px-0">
            <Link href="/auth/sign-in">here</Link>
          </Button>{" "}
          to sign in.
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-gray-50 pt-8">
      <form
        id="sign-up"
        onSubmit={handleSubmit(submit)}
        className="space-y-8 max-w-[400px]"
      >
        <CardHeader>
          <CardTitle>Please sign up to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    placeholder="Enter your username"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>Optional</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    type="password"
                    placeholder="Confirm your password"
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
                form="sign-up"
              >
                Sign up
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
            <OAuthSigninButtons signup={true} />
          </FieldGroup>
        </CardContent>
      </form>
      <CardFooter>
        <div className="flex gap-1 text-sm mb-[5px] mt-[5px]">
          <p className="hidden md:block">Already have an account?</p>
          <Link
            key="create-account"
            href="/auth/sign-in"
            className="underline flex h-[20px] grow items-center justify-center gap-2 rounded-md font-medium hover:text-blue-600 md:flex-none md:justify-start"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export const SignupFormSkeleton = () => {
  return (
    <Card className="bg-gray-50 pt-8">
      <form id="sign-up" className="space-y-8 max-w-[400px]">
        <CardHeader>
          <CardTitle>Please sign up to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <Field orientation="horizontal">
              <div className="h-10 w-full rounded-md bg-gray-200" />
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
