import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { OAuth2Client } from "google-auth-library";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GithubClientId,
      clientSecret: process.env.GithubClientSecret,
    }),
    GoogleProvider({
      clientId: process.env.GoogleClientId,
      clientSecret: process.env.GoogleClientSecret,
    }),
    CredentialsProvider({
      id: "dns_manager",
      name: "dns_manager",
      credentials: {
        Credential: { type: "text" },
      },
      authorize: async (credentials) => {
        const token = credentials.Credential;
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.CLIENT_GOOGLE_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Cannot extract payload from signin token");
        }
        const {
          email,
          name,
          sub,
          given_name,
          family_name,
          email_verified,
          picture: image,
        } = payload;
        if (!email) {
          throw new Error("Email not available");
        }

        const user = { email, name, image };
        console.log("user----", user);
        return user;
      },
    }),
    
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn: '/signin',
  }
};

export default NextAuth(authOptions);
