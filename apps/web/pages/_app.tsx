import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../src/components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
