"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateUserProfile, updateUserPassword } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const profileSchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(2, "Enter a valid address"),
  city: z.string().min(2, "Enter a valid city"),
  state: z.string().min(2, "Enter a valid state"),
  ssn: z.string().min(4, "SSN is too short"),
  postal_code: z.string().min(5, "Enter a valid postal code"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
})

const passwordSchema = z
  .object({
    old_password: z.string().min(6, "Password must be at least 6 characters"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

type UserProfileFormProps = {
  initialData: z.infer<typeof profileSchema>
}

const UserProfileForm = ({ initialData }: UserProfileFormProps) => {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true)
    try {
      const result = await updateUserProfile(data)
      if (result.success) {
        console.log("Profile updated successfully")
      } else {
        console.error("Failed to update profile:", result.error)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
  //   setIsLoading(true)
  //   try {
  //     const result = await updateUserPassword(data)
  //     if (result.success) {
  //       console.log("Password updated successfully")
  //       passwordForm.reset()
  //     } else {
  //       console.error("Failed to update password:", result.error)
  //     }
  //   } catch (error) {
  //     console.error("Error updating password:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Personal Settings
          </TabsTrigger>
          {/* <TabsTrigger value="withdrawal">Withdrawal Settings</TabsTrigger> */}
          {/* <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Password/Security
          </TabsTrigger> */}
          {/* <TabsTrigger value="other">Other Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="personal" className="mt-8">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <FormField
                control={profileForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="h-12 bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">City</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">State</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">SSN</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* <TabsContent value="security" className="mt-8">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Old Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

export default UserProfileForm

