import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { OAuth2Client } from "google-auth-library";
import { connectMongodb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
// console.log(process.env.GoogleClientId);
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GithubClientId,
    //   clientSecret: process.env.GithubClientSecret,
    // }),
    GoogleProvider({
      clientId: process.env.GoogleClientId,
      clientSecret: process.env.GoogleClientSecret,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        Credential: { type: "text" },
      },
      authorize: async (credentials) => {
        // const token = credentials.Credential;
        // const ticket = await googleAuthClient.verifyIdToken({
        //   idToken: token,
        //   audience: process.env.CLIENT_GOOGLE_ID,
        // });
        // const payload = ticket.getPayload();
        // if (!payload) {
        //   throw new Error("Cannot extract payload from signin token");
        // }
        // const {
        //   email,
        //   name,
        //   sub,
        //   given_name,
        //   family_name,
        //   email_verified,
        //   picture: image,
        // } = payload;
        // if (!email) {
        //   throw new Error("Email not available");
        // }

        // const user = { email, name, image };
        // console.log("user----", user);
        // return user;
        console.log(credentials);
        const { email, password } = credentials;
        try {
          const resUserExists = await fetch(
            `https://dns-manager-seven.vercel.app/api/user/validate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          const { user } = await resUserExists.json();
          console.log(user);
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // must for credentialProvider
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("User:", user);
      console.log("Account:", account);

      if (account.provider === "google") {
        const { name, email } = user;
        try {
          const res = await fetch(
            `https://dns-manager-seven.vercel.app/api/user/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                password: name,
              }),
            }
          );

          if (res.ok) {
            return user;
          }
        } catch (error) {
          console.log(error);
        }
      }
      return user;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
