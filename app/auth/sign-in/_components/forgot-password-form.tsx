"use client";

import { forgotPasswordAction } from "@/actions/forgot-password-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
} from "@/validators/forgot-password-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: ForgotPasswordInput) => {
    setSuccess("");

    const res = await forgotPasswordAction(values);

    console.log(res);

    if (res.success) {
      setSuccess("Password reset email sent.");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.fieldErrors;

          if (nestedErrors && "email" in nestedErrors) {
            setError("email", {
              message: nestedErrors.email?.[0],
            });
          } else {
            setError("email", {
              message: "Internal Server Error",
            });
          }
          break;
        case 401:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          console.log(error);
          setError("email", { message: error });
      }
    }
  };
  return (
    <Dialog>
      Forgot your password? Click{" "}
      <DialogTrigger className="pl-0 underline font-medium hover:text-blue-600 md:flex-none md:justify-start">
        here
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>
              We will send you an email with a link to reset your password.
            </DialogDescription>
            <Card className="bg-gray-50 pt-8">
              {/* <CardHeader>
                <CardTitle>Please sign in to continue</CardTitle>
              </CardHeader> */}
              <CardContent>
                <FieldGroup>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          disabled={!!success}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}

                        <FieldDescription />
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              disabled={formState.isSubmitting || !!success}
              className="w-full"
            >
              {formState.isSubmitting == true ? (
                <div>Sending...</div>
              ) : (
                <div>Send Password Reset Email</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
