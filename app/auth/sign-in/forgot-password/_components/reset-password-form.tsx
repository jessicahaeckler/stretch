"use client";

import { resetPasswordAction } from "@/actions/reset-password-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/validators/reset-password-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type ResetPasswordFormProps = { email: string; token: string };

export default function ResetPasswordForm({
  email,
  token,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: ResetPasswordInput) => {
    console.log("heeere");
    const res = await resetPasswordAction(email, token, values);

    if (res.success) {
      router.push("/auth/sign-in/reset-password/success");
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
        case 401:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          console.log(error);
          setError("confirmPassword", { message: error });
      }
    }
  };
  return (
    <Card className="bg-gray-50 pt-8">
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <CardContent>
          <FieldGroup>
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
              >
                Reset Password
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </form>
    </Card>
  );
}
