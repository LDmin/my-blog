import { useCallback } from "react";
import { Layout, Menu, theme } from "antd";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

import styles from "@/styles/components/AppLayout.module.css";

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<WithRouterProps & IPropsChildren> = ({
  children,
  router,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChangeTab = useCallback(({ key }: { key: string }) => {
    router.push(key);
  }, []);

  return (
    <>
      <Layout className={`${styles.layout}`}>
        <Header className={`${styles.header}`}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[router.pathname]}
            onClick={onChangeTab}
            items={[
              {
                label: "前台页面",
                key: "/front/list",
              },
              {
                label: "后台管理",
                key: "/admin/list",
              },
            ]}
          />
        </Header>
        <Content className={`${styles["content-wrapper"]}`}>
          <div className={`${styles["content"]}`}>{children}</div>
        </Content>
      </Layout>
    </>
  );
};

export default withRouter(AppLayout);
