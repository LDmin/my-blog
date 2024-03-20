import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import AppLayout from "@/components/AppLayout";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              headerBg: "#ffffff",
            },
          },
        }}
      >
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ConfigProvider>
    </ApolloProvider>
  );
}
