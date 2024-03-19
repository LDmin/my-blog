import Head from "next/head";
import styles from "@/styles/admin/List.module.css";
import Table, { TableProps } from "antd/lib/table";
import { ArticleProps } from "@/components/Article";
import client from "@/lib/apollo-client";
import { gql } from "graphql-tag";
import { GetServerSideProps } from "next";
import Button from "antd/lib/button";
import Link from "next/link";
import dayjs from "dayjs";
import Space from "antd/lib/space";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await client.query({
    query: gql`
      query MyQuery {
        articles(skip: 0, take: 100) {
          id
          title
          createdAt
        }
        count
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
};

function ArticleList({
  data,
}: {
  data: { articles: ArticleProps[]; count: number };
}) {
  // const { query } = useRouter();
  // const skip = Number(query.skip || "0");
  // const take = Number(query.take || "10");
  console.log(data);
  const columns: TableProps<{
    title: string;
  }>["columns"] = [
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "添加时间",
      dataIndex: "createdAt",
      render: (v) => dayjs(Number(v)).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "handle",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">
            编辑
          </Button>
          <Button type="primary" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Article List</title>
        <meta name="description" content="This is my blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.wrapper}`}>
        <Link href="/admin/edit">
          <Button type="primary">添加文章</Button>
        </Link>
        <Table
          rowKey="id"
          className={`${styles.table}`}
          dataSource={data.articles}
          columns={columns}
          pagination={{
            total: data.count,
            pageSize: 5,
          }}
        />
      </div>
    </>
  );
}

export default ArticleList;
