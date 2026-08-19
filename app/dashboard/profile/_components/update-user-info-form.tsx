"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type UpdateUserInfoInput,
  UpdateUserInfoSchema,
} from "@/validators/update-user-info-validator";
import { type User } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { updateUserInfoAction } from "@/actions/update-user-info-action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UpdateUserInfoFormProps = { user: User };

export const UpdateUserInfoForm = ({ user }: UpdateUserInfoFormProps) => {
  const [success, setSuccess] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();
  const { id, name: defaultName } = user;
  const form = useForm<UpdateUserInfoInput>({
    resolver: zodResolver(UpdateUserInfoSchema),
    defaultValues: {
      id,
      name: defaultName || "",
    },
  });
  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: UpdateUserInfoInput) => {
    const res = await updateUserInfoAction(values);
    if (res.success) {
      const updatedUser = res.data;

      if (session?.user) {
        await update({
          ...session,
          user: { ...session.user, name: updatedUser.name },
        });
      }
      router.refresh();
      setSuccess("User information updated successfully.");
      console.log(res.data);
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.fieldErrors;
          console.log(nestedErrors);

          for (const key of Object.keys(nestedErrors) as Array<
            keyof typeof nestedErrors
          >) {
            console.log(key);
            setError(key, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 401:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("name", { message: error });
      }
    }
  };
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSuccess("");
        }
      }}
    >
      <DialogTrigger className="p-2 font-bold bg-primary text-primary-foreground hover:bg-primary/80 bg-yellow-600 transition-colors hover:bg-yellow-600/80 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        <PencilIcon />
      </DialogTrigger>

      <DialogContent>
        <form
          id="edit-user"
          onSubmit={handleSubmit(submit)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogDescription>
              Update your user information below.
            </DialogDescription>
            <Card className="bg-gray-50 pt-8">
              <CardContent>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input {...field} id="name" type="text" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-md text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="id"
                    control={control}
                    render={() => <Field />}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full"
            >
              {formState.isSubmitting == true ? (
                <div>Updating...</div>
              ) : (
                <div>Update</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
