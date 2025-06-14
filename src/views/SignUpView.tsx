"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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

const phoneInputStyles = {
  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: "2.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    paddingLeft: "3.5rem",
    backgroundColor: "white",
    color: "#1f2937",
    "&:focus": {
      outline: "none",
      borderColor: "#6366f1",
      boxShadow: "0 0 0 1px #6366f1",
    },
  },
  button: {
    border: "1px solid #e2e8f0",
    borderRight: "none",
    borderRadius: "0.375rem 0 0 0.375rem",
    backgroundColor: "white",
  },
  dropdown: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
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
    shouldInviteToWhatsapp: z.boolean().optional(),
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

export default function SignUpView() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      shouldInviteToWhatsapp: false,
      shouldReceiveUpdates: false,
    },
  });

  const isAlreadyInWhatsapp = form.watch("isAlreadyInWhatsapp");

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create user
      console.log(data);
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Card className="sm:mx-auto sm:w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Join Kop Kenya OLSC</CardTitle>
          <CardDescription className="space-y-2">
            <p>
              Welcome to Kop Kenya, the official Liverpool FC Official Liverpool
              Supporters Club (OLSC) in Kenya. We bring together Kenyan Reds to
              share our passion for Liverpool FC.
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
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<SignUpFormData, "name">;
                }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We&apos;ll use this to send you important club updates and
                      event information
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
                    <FormLabel>Phone Number</FormLabel>
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
                      We&apos;ll use this to contact you about events and match
                      screenings
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
                  field: ControllerRenderProps<SignUpFormData, "dateOfBirth">;
                }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      You must be at least 18 years old to join
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
                    <FormLabel>
                      Are you already in the Kop Kenya WhatsApp group?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes, I am already in the group
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No, I am not in the group
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Our WhatsApp group is where we coordinate match screenings
                      and share updates
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
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Join WhatsApp Group</FormLabel>
                        <FormDescription>
                          I would like to join the Kop Kenya WhatsApp group to
                          stay connected with fellow supporters
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Receive Updates</FormLabel>
                      <FormDescription>
                        I would like to receive updates about match screenings,
                        events, and club activities
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Join Kop Kenya"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
