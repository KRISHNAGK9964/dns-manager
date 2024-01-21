import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  
  return (
    // wrap the application with SessionProvider to access session object nextAuth
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
