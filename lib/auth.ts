import { prisma } from "@/db/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./email";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
      /*nickname: {
        type: "string",
        required: false,        
      },*/
      details: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      popularity: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      gender: {
        type: "string",
        required: true,
      },
      genderSearch: {
        type: "string",
        required: false,
      },
      dob: {
        type: "date",
        required: true,
      },
      bio: {
        type: "string",
        required: false,
      },
      lastLogin: {
        type: "date",
        required: false,
      }
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [admin()],
  /*advanced: {
    database: {
      generateId: false,
    },
  },*/
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(
        user.email,
        "Reset your password",
        `Click the link to reset your password: ${url}`
      );
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    },
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    },
  },
});
