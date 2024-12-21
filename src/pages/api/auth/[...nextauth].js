// src/pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectMongoDB from '@/lib/mongodb';
import { Users } from '@/models/Users';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH2_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectMongoDB();
          const existingUser = await Users.findOne({ email: user.email });
          if (!existingUser) {
            await Users.create({
              email: user.email,
              name: user.name,
              imageURL: user.image,
              googleId: account.providerAccountId,
              password: '', 
              isVerified: true
            });
          }
          return true;
        } catch (error) {
          console.log("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      try {
        await connectMongoDB();
        const user = await Users.findOne({ email: session.user.email });
        if (user) {
          session.user.role = user.role;
          session.user.id = user._id.toString();
        }
        return session;
      } catch (error) {
        console.log("Error in session callback:", error);
        return session;
      }
    }
  },
});