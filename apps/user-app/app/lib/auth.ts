import { prisma } from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

interface Credentials {
  phone: string;
  password: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        try {
          // Basic validation (replace with zod if desired)
          const phone = credentials?.phone ;
          const password = credentials?.password;
          if (
            typeof phone !== "string" ||
            typeof password !== "string" ||
            !phone ||
            !password
          ) {
            return null;
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          console.log(hashedPassword);

          // number is unique in schema → prefer findUnique
          const existingUser = await prisma.user.findFirst({
            where: { number: phone },
          });

          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              password,
              existingUser.password
            );
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.email,
              };
            }
            return null;
          }

          const user = await prisma.user.create({
            data: {
              number: phone,
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (e) {
          console.error("authorize() error:", e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: { token: any; session: any }) {
      session.user.id = token.sub;

      return session;
    },
  },
};
