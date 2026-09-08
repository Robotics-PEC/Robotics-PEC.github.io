import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics } from '@next/third-parties/google';

export default function Document() {
  const gaID = process.env.NEXT_PUBLIC_GA_ID ?? "";
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/title_logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <GoogleAnalytics gaId={gaID} />
      </body>
    </Html>
  );
}
