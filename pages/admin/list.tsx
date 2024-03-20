import Head from "next/head";
import styles from "@/styles/admin/List.module.css";
import { Table, Button, Space, TableProps, Popconfirm, message } from "antd";
import { ArticleProps } from "@/components/Article";
import client from "@/lib/apollo-client";
import { GetServerSideProps } from "next";
import Link from "next/link";
import dayjs from "dayjs";
import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { useRouter } from "next/router";

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
    fetchPolicy: "no-cache",
  });

  return {
    props: {
      data,
    },
  };
};

const DeleteArticleMutation = gql`
  mutation DeleteArticleMutation($id: ID!) {
    deleteArticle(id: $id) {
      id
      title
      content
      createdAt
    }
  }
`;

function ArticleList({
  data,
}: {
  data: { articles: ArticleProps[]; count: number };
}) {
  const router = useRouter();
  const skip = Number(router.query.skip || "0");
  const take = Number(router.query.take || "10");

  const [deleteArticle] = useMutation(DeleteArticleMutation);

  const deleteArticleHandle = useCallback(async (id: number) => {
    await deleteArticle({
      variables: {
        id,
      },
    });
    message.success("文章已删除！");
    router.reload();
  }, []);

  const onPageChange = useCallback((page: number, pageSize: number) => {
    console.log(router, page, pageSize);
    router.push(`${router.pathname}?skip=${page - 1}&take=${pageSize}`);
  }, []);

  const columns: TableProps<ArticleProps>["columns"] = [
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
          <Link href={`/admin/edit/${record.id}`}>
            <Button type="primary" size="small">
              编辑
            </Button>
          </Link>
          <Popconfirm
            title="删除文章"
            description="您确定要删除此文章?"
            onConfirm={() => deleteArticleHandle(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" size="small" danger>
              删除
            </Button>
          </Popconfirm>
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
            current: skip + 1,
            pageSize: take,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}

export default ArticleList;
