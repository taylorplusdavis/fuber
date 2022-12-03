import "../styles/globals.css";
import "../styles/fonts.css";
import type { AppProps } from "next/app";
import { AppWrapper } from "../context/map";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
