"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from 'lucide-react';
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State name is too short"),
  postal_code: z.string().min(5, "Postal code is too short"),
  ssn: z.string().min(10, "ssn is not valid"),
});

type UserProfileFormProps = {
  initialData: z.infer<typeof formSchema>;
};

const UserProfileForm = ({ initialData }: UserProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateUserProfile(data);
      if (result.success) {
        console.log("Profile updated successfully");
        setIsEditing(false);
        // You might want to show a success message to the user here
      } else {
        console.error("Failed to update profile:", result.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const FormField = ({ name, label, placeholder }: { name: keyof z.infer<typeof formSchema>, label: string, placeholder: string }) => (
    <FormItem className="border-t border-gray-200">
      <div className="payment-transfer_form-item py-5">
        <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
          {label}
        </FormLabel>
        <div className="flex w-full flex-col">
          {isEditing ? (
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                {...form.register(name)}
              />
            </FormControl>
          ) : (
            <div className="text-14 text-gray-900">{form.getValues(name)}</div>
          )}
          <FormMessage className="text-12 text-red-500" />
        </div>
      </div>
    </FormItem>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Profile
            </Button>
          )}
        </div>

        <FormField name="first_name" label="First Name" placeholder="Enter your first name" />
        <FormField name="last_name" label="Last Name" placeholder="Enter your last name" />
        <FormField name="email" label="Email Address" placeholder="ex: johndoe@example.com" />
        <FormField name="address" label="Address" placeholder="Enter your address" />
        <FormField name="city" label="City" placeholder="Enter your city" />
        <FormField name="state" label="State" placeholder="Enter your state" />
        <FormField name="postal_code" label="Postal Code" placeholder="Enter your postal code" />
        <FormField name="ssn" label="ssn" placeholder="Enter your ssn" />

        {isEditing && (
          <div className="payment-transfer_btn-box mt-6">
            <Button type="submit" className="payment-transfer_btn mr-4">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default UserProfileForm;

