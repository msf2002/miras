'use server';


import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}

export async function registerUser(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, email, password } = validated.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "این ایمیل قبلاً ثبت شده است" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return { success: "ثبت‌نام با موفقیت انجام شد" };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "ایمیل یا رمز عبور اشتباه است" };
        default:
          return { error: "خطایی رخ داد" };
      }
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}
