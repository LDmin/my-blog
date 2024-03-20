import Head from "next/head";
import styles from "@/styles/front/List.module.css";
import { ArticleProps } from "@/components/Article";
import client from "@/lib/apollo-client";
import { gql } from "graphql-tag";
import { GetServerSideProps } from "next";
import Link from "next/link";
import dayjs from "dayjs";
import { List } from "antd";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await client.query({
    query: gql`
      query MyQuery {
        articles(skip: 0, take: 100) {
          id
          title
          createdAt
        }
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
};

function ArticleList({ data }: { data: { articles: ArticleProps[] } }) {
  return (
    <>
      <Head>
        <title>Article List</title>
        <meta name="description" content="This is my blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.wrapper}`}>
        <List
          itemLayout="horizontal"
          dataSource={data.articles}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link href={`/front/detail/${item.id}`}>{item.title}</Link>
                }
                description={dayjs(Number(item.createdAt)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default ArticleList;
