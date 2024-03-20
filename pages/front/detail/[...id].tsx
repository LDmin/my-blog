import { ArticleProps } from "@/components/Article";
import client from "@/lib/apollo-client";
import { Typography, Divider } from "antd";
import gql from "graphql-tag";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import styles from "@/styles/front/Detail.module.css";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);

  const { data } = await client.query({
    query: gql`
      query QueryArticle($id: ID!) {
        article(id: $id) {
          id
          title
          content
          createdAt
        }
      }
    `,
    variables: {
      id,
    },
  });

  return {
    props: {
      data,
    },
  };
};

function ArticleDetail({ data }: { data: { article: ArticleProps } }) {
  return (
    <>
      <Head>
        <title>{data.article.title}</title>
        <meta name="description" content={data.article.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.back}`}>
          <Link href="/front/list">
            <ArrowLeftOutlined /> 返回列表
          </Link>
        </div>
        <div className={`${styles.title}`}>
          <Typography.Title level={2}>{data.article.title}</Typography.Title>
          <Typography.Text type="secondary">
            发布日期:
            {dayjs(Number(data.article.createdAt)).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </Typography.Text>
        </div>
        <Divider></Divider>
        <ReactMarkdown>{data.article.content}</ReactMarkdown>
      </div>
    </>
  );
}

export default ArticleDetail;
