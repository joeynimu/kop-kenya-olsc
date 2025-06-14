"use server";

import prisma from "./prismaClient";
import { ErrorCodes } from "@/src/lib/errors";

type SignUpFormData = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isAlreadyInWhatsapp: string;
  shouldInviteToWhatsapp: boolean | undefined;
  shouldReceiveUpdates: boolean;
};

export async function signUpUser(data: SignUpFormData) {
  try {
    // Check for existing user with the same email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: {
          message:
            "A user with this email or phone number is already registered",
          code: ErrorCodes.USER_EXISTS,
        },
      };
    }

    // create user if all is well
    await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        invitedToWhatsapp: data.isAlreadyInWhatsapp === "yes",
        shouldInviteToWhatsapp: data.shouldInviteToWhatsapp,
        shouldReceiveUpdates: data.shouldReceiveUpdates,
      },
    });

    return {
      success: true,
      message: "You have been successfully signed up.",
    };
  } catch (error) {
    console.error("Error signing up:", error);

    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        code: ErrorCodes.UNKNOWN_ERROR,
      },
    };
  }
}
