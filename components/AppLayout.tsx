import { useCallback } from "react";
import Breadcrumb from "antd/lib/breadcrumb";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import theme from "antd/lib/theme";
import MenuProps from "antd/lib/menu";

import styles from "./AppLayout.module.css";

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<IPropsChildren> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChangeTab = useCallback(({ key }) => {
    console.log(key);
  }, []);

  return (
    <>
      <Layout className={`${styles.layout}`}>
        <Header className={`${styles.header}`}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            onClick={onChangeTab}
            items={[
              {
                label: "前台页面",
                key: "/",
              },
              {
                label: "后台管理",
                key: "/admin",
              },
            ]}
          />
        </Header>
        <Content className={`${styles.content}`}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default AppLayout;
