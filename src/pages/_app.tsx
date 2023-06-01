import type { AppType } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

import { trpc } from "~/lib/trpc";

import "~/styles/global.css";

import { GlobalContextProvider } from "~/context/Global";
import { NotificationProvider } from "~/context/Notification";
import { Layout } from "~/components/Layout";

const title = "Fireblocks Tokenization Lab";
const description = "Deploy, mint, and burn an ERC-20 token";
const color = "#F5F5F5";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalContextProvider>
        <NotificationProvider>
          <Head>
            <title>{title}</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />
            <meta name="robots" content="noindex, nofollow" />
            <meta name="description" content={description} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={title} />
            <meta
              property="og:image"
              content="https://www.fireblocks.com/wp-content/uploads/2020/10/Fireboocks-Open-Graph@1x.jpg"
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@FireblocksHQ" />
            <meta name="theme-color" content={color} />
            <meta name="mobile-web-app-capable" content="yes" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="icon" href="/icons/favicon-32x32.png" sizes="32x32" />
            <link
              rel="icon"
              href="/icons/favicon-192x192.png"
              sizes="192x192"
            />
            <link rel="apple-touch-icon" href="/icons/favicon-180x180.png" />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationProvider>
      </GlobalContextProvider>
      <Analytics />
    </>
  );
};

export default trpc.withTRPC(App);
