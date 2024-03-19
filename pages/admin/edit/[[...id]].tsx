import { ArticleProps } from "@/components/Article";
import Form, { FormProps } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";
import styles from "@/styles/admin/Edit.module.css";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import DatePicker from "antd/lib/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
// import Editor from "for-editor";
import { useRef } from "react";
import { GetServerSideProps } from "next";
import client from "@/lib/apollo-client";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("for-editor") as any, {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  let id = context.params?.id as string;

  if (!id) {
    return {
      props: {},
    };
  }

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
      id: Number(id),
    },
  });

  return {
    props: {
      data,
    },
  };
};

const CreateArticleMutation = gql`
  mutation CreateDraftMutation(
    $title: String!
    $content: String!
    $createdAt: String!
  ) {
    createArticle(title: $title, content: $content, createdAt: $createdAt) {
      id
      title
      content
      createdAt
    }
  }
`;

function CreateArticle({ data }: { data: { article: ArticleProps } }) {
  const editor = useRef(null);
  const [createArticle] = useMutation(CreateArticleMutation);
  const router = useRouter();

  const onFinish: FormProps<ArticleProps>["onFinish"] = async (values) => {
    await createArticle({
      variables: {
        title: values.title,
        content: values.content,
        createdAt: (values.createdAt as unknown as Dayjs).valueOf().toString(),
      },
    });
    router.push("/admin/list");
  };
  console.log(data);
  return (
    <div className="layout-content">
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        className={`${styles.form}`}
        initialValues={{
          title: data?.article.title || "",
          content: data?.article.content || "",
          createdAt: data?.article.createdAt
            ? dayjs(Number(data.article.createdAt))
            : dayjs(),
        }}
        onFinish={onFinish}
      >
        <FormItem<ArticleProps>
          label="文章标题"
          name="title"
          rules={[{ required: true, message: "请输入文章标题!" }]}
        >
          <Input />
        </FormItem>
        <FormItem<ArticleProps>
          label="文章内容"
          name="content"
          rules={[{ required: true, message: "请输入文章内容!" }]}
        >
          {/* <TextArea rows={10} /> */}
          <Editor />
        </FormItem>
        <FormItem<ArticleProps>
          label="发布时间"
          name="createdAt"
          rules={[{ required: true }]}
        >
          <DatePicker showTime needConfirm={false} />
        </FormItem>
        <FormItem wrapperCol={{ offset: 4, span: 20 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              发布文章
            </Button>
            <Link href="/admin/list">
              <Button type="primary" danger>
                返回列表
              </Button>
            </Link>
          </Space>
        </FormItem>
      </Form>
    </div>
  );
}

export default CreateArticle;
