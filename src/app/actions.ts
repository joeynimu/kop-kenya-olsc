"use server";

import prisma from "./prismaClient";
import { AppError, ErrorCodes } from "@/src/lib/errors";

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
      throw new AppError(
        "A user with this email or phone number is already registered",
        ErrorCodes.USER_EXISTS
      );
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

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(error.message, ErrorCodes.UNKNOWN_ERROR, 500);
    }

    throw new AppError(
      "An unexpected error occurred",
      ErrorCodes.UNKNOWN_ERROR,
      500
    );
  }
}
