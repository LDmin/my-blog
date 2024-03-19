import Head from "next/head";
import styles from "@/styles/Front.module.css";
import Button from "antd/lib/button";

export default function Front() {
  return (
    <>
      <Head>
        <title>My Blog</title>
        <meta name="description" content="This is my blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.wrapper}`}>
        <Button type="primary">Button</Button>
      </div>
    </>
  );
}
