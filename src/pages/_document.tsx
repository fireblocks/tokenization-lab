import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head />
      <body className="h-full bg-neutral-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
