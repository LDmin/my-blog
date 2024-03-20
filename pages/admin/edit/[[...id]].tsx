import {
  Form,
  FormProps,
  Input,
  Button,
  Space,
  DatePicker,
  message,
} from "antd";
import styles from "@/styles/admin/Edit.module.css";
import dayjs, { Dayjs } from "dayjs";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
// import Editor from "for-editor";
import { useRef } from "react";
import { GetServerSideProps } from "next";
import client from "@/lib/apollo-client";
import dynamic from "next/dynamic";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const Editor = dynamic(() => import("for-editor") as any, {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  let id = (context.params?.id as string[])?.[0];

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
  mutation CreateArticleMutation(
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

const UpdateArticleMutation = gql`
  mutation UpdateArticleMutation(
    $id: ID!
    $title: String!
    $content: String!
    $createdAt: String!
  ) {
    updateArticle(
      id: $id
      title: $title
      content: $content
      createdAt: $createdAt
    ) {
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
  const [updateArticle] = useMutation(UpdateArticleMutation);
  const router = useRouter();

  const onFinish: FormProps<ArticleProps>["onFinish"] = async (values) => {
    if (data?.article?.id) {
      await updateArticle({
        variables: {
          id: data.article?.id,
          title: values.title,
          content: values.content,
          createdAt: (values.createdAt as unknown as Dayjs)
            .valueOf()
            .toString(),
        },
      });
    } else {
      await createArticle({
        variables: {
          title: values.title,
          content: values.content,
          createdAt: (values.createdAt as unknown as Dayjs)
            .valueOf()
            .toString(),
        },
      });
    }
    message.success(`文章已${data?.article?.id ? "修改" : "添加"}`);
    router.push("/admin/list");
  };

  return (
    <div className="layout-content">
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        className={`${styles.form}`}
        initialValues={{
          title: data?.article?.title || "",
          content: data?.article?.content || "",
          createdAt: data?.article?.createdAt
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
