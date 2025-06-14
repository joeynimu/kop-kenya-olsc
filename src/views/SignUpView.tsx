"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "@/src/app/actions";
import { toast } from "sonner";

// Liverpool FC colors
const colors = {
  primary: "#C8102E", // Liverpool Red
  secondary: "#F6EB61", // Liverpool Yellow
  dark: "#1A1A1A", // Dark gray for text
  light: "#FFFFFF", // White
  gray: "#F3F4F6", // Light gray for backgrounds
};

const phoneInputStyles = {
  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: "2.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    border: `1px solid ${colors.primary}`,
    borderRadius: "0.375rem",
    paddingLeft: "3.5rem",
    backgroundColor: colors.light,
    color: colors.dark,
    "&:focus": {
      outline: "none",
      borderColor: colors.primary,
      boxShadow: `0 0 0 1px ${colors.primary}`,
    },
  },
  button: {
    border: `1px solid ${colors.primary}`,
    borderRight: "none",
    borderRadius: "0.375rem 0 0 0.375rem",
    backgroundColor: colors.light,
  },
  dropdown: {
    backgroundColor: colors.light,
    border: `1px solid ${colors.primary}`,
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  countryList: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  search: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    margin: "0.5rem",
  },
  country: {
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  selectedCountry: {
    backgroundColor: "#f3f4f6",
  },
};

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(8, "Phone number is too short")
      .max(15, "Phone number is too long")
      .refine((value) => {
        // Remove any non-digit characters for validation
        const digitsOnly = value.replace(/\D/g, "");
        // Basic validation for international numbers:
        // - Must start with a country code (1-3 digits)
        // - Must have at least 7 digits after the country code
        // - Total length should be between 8 and 15 digits
        return digitsOnly.length >= 8 && digitsOnly.length <= 15;
      }, "Please enter a valid international phone number"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    dateOfBirth: z.string().refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "You must be at least 18 years old"),
    isAlreadyInWhatsapp: z.enum(["yes", "no"], {
      required_error: "Please select if you are already in the WhatsApp group",
    }),
    shouldInviteToWhatsapp: z.boolean(),
    shouldReceiveUpdates: z.boolean(),
  })
  .refine(
    (data) => {
      // If not in WhatsApp, require the invitation checkbox
      if (data.isAlreadyInWhatsapp === "no") {
        return data.shouldInviteToWhatsapp === true;
      }
      return true;
    },
    {
      message:
        "You must agree to join the WhatsApp group if you're not already a member",
      path: ["shouldInviteToWhatsapp"],
    }
  );

type SignUpFormData = z.infer<typeof signUpSchema>;

type SignUpResponse = {
  success: boolean;
  message?: string;
  error?: {
    message: string;
    code: string;
  };
};

export default function SignUpView() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: signUpUser,
    onSuccess: (response: SignUpResponse) => {
      if (response.success) {
        toast.success(response.message);
        form.reset();
      } else if (response.error?.message) {
        toast.error(response.error.message);
      } else {
        toast.error("An unexpected error occurred during sign up");
      }
    },
    onError: (error: unknown) => {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred during sign up");
    },
  });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      shouldInviteToWhatsapp: false,
      shouldReceiveUpdates: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => mutateAsync(data);

  const isAlreadyInWhatsapp = form.watch("isAlreadyInWhatsapp");
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
          <div className="h-[200px] lg:h-screen w-full overflow-hidden relative">
            <Image
              src="/images/champions.webp"
              alt="Liverpool FC Champions"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Form Column */}
        <div className="w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-md border-2 border-[#C8102E] shadow-lg">
            <CardHeader className="bg-[#C8102E] text-white pt-1">
              <CardTitle className="text-2xl font-bold">
                Join Kop Kenya OLSC
              </CardTitle>
              <CardDescription className="text-white/90 space-y-2 pb-2">
                <p>
                  Welcome to Kop Kenya, the official Liverpool FC Official
                  Liverpool Supporters Club (OLSC) in Kenya. We bring together
                  Kenyan Reds to share our passion for Liverpool FC.
                </p>
                <p>By joining our community, you&apos;ll get access to:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Match screenings and watch parties</li>
                  <li>Exclusive club events and meetups</li>
                  <li>Updates on Liverpool FC news and activities</li>
                  <li>A vibrant community of fellow supporters</li>
                </ul>
                <p className="pt-2">
                  Fill in your details below to become a member.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<SignUpFormData, "name">;
                    }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A]">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="border-[#C8102E] focus:border-[#C8102E] focus:ring-[#C8102E]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<SignUpFormData, "email">;
                    }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A]">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            className="border-[#C8102E] focus:border-[#C8102E] focus:ring-[#C8102E]"
                          />
                        </FormControl>
                        <FormDescription>
                          We&apos;ll use this to send you important club updates
                          and event information
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<SignUpFormData, "phone">;
                    }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A]">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            country="ke"
                            value={field.value}
                            onChange={field.onChange}
                            inputStyle={phoneInputStyles.input}
                            buttonStyle={phoneInputStyles.button}
                            containerStyle={phoneInputStyles.container}
                            dropdownStyle={phoneInputStyles.dropdown}
                            inputProps={{
                              name: "phone",
                              required: true,
                            }}
                            specialLabel=""
                            enableSearch
                            searchPlaceholder="Search country..."
                            searchNotFound="No country found"
                            countryCodeEditable={false}
                          />
                        </FormControl>
                        <FormDescription>
                          We&apos;ll use this to contact you about events and
                          match screenings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        SignUpFormData,
                        "dateOfBirth"
                      >;
                    }) => {
                      // Calculate the date 18 years ago from today
                      const today = new Date();
                      const maxDate = new Date(
                        today.getFullYear() - 18,
                        today.getMonth(),
                        today.getDate()
                      );
                      const minDate = new Date(1900, 0, 1); // Set a reasonable minimum date

                      return (
                        <FormItem>
                          <FormLabel className="text-[#1A1A1A]">
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              max={maxDate.toISOString().split("T")[0]}
                              min={minDate.toISOString().split("T")[0]}
                              className="border-[#C8102E] focus:border-[#C8102E] focus:ring-[#C8102E]"
                            />
                          </FormControl>
                          <FormDescription>
                            You must be at least 18 years old to join
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="isAlreadyInWhatsapp"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        SignUpFormData,
                        "isAlreadyInWhatsapp"
                      >;
                    }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[#1A1A1A]">
                          Are you already in the Kop Kenya WhatsApp group?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === "yes") {
                                form.setValue("shouldInviteToWhatsapp", false);
                              }
                              if (value === "no") {
                                form.setValue("shouldInviteToWhatsapp", true);
                              }
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="yes"
                                  className="border-[#C8102E] text-[#C8102E] data-[state=checked]:bg-white data-[state=checked]:text-[#C8102E] data-[state=checked]:border-[#C8102E] [&>span]:bg-[#C8102E]"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yes, I am already in the group
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="no"
                                  className="border-[#C8102E] text-[#C8102E] data-[state=checked]:bg-white data-[state=checked]:text-[#C8102E] data-[state=checked]:border-[#C8102E] [&>span]:bg-[#C8102E]"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No, I am not in the group
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Our WhatsApp group is where we coordinate match
                          screenings and share updates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAlreadyInWhatsapp === "no" && (
                    <FormField
                      control={form.control}
                      name="shouldInviteToWhatsapp"
                      render={({
                        field,
                      }: {
                        field: ControllerRenderProps<
                          SignUpFormData,
                          "shouldInviteToWhatsapp"
                        >;
                      }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-[#C8102E] text-[#C8102E] data-[state=checked]:bg-[#C8102E] data-[state=checked]:text-white data-[state=checked]:border-[#C8102E]"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Join WhatsApp Group</FormLabel>
                            <FormDescription>
                              I would like to join the Kop Kenya WhatsApp group
                              to stay connected with fellow supporters
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="shouldReceiveUpdates"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        SignUpFormData,
                        "shouldReceiveUpdates"
                      >;
                    }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#C8102E] text-[#C8102E] data-[state=checked]:bg-[#C8102E] data-[state=checked]:text-white data-[state=checked]:border-[#C8102E]"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Receive Updates</FormLabel>
                          <FormDescription>
                            I would like to receive updates about match
                            screenings, events, and club activities
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="text-sm text-gray-600 text-center">
                    By joining, you agree to our{" "}
                    <a
                      href="/privacy-policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8102E] hover:text-[#A00D24] underline"
                    >
                      Privacy Policy
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#C8102E] hover:bg-[#A00D24] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    disabled={isPending}
                  >
                    {isPending ? "Creating account..." : "Join Kop Kenya"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
