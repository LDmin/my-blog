import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ConfigProvider from "antd/lib/config-provider";
import AppLayout from "@/components/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}
