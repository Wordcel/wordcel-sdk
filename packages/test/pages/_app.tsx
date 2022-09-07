import "../styles/globals.css";
import type { AppProps } from "next/app";
import {} from "@wordcel/wordcel-ts";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
