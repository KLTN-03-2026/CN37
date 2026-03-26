import classNames from "classnames/bind";
import styles from "./SidebarLayout.module.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarSettings from "../components/SidebarSetting";

const cx = classNames.bind(styles);

export default function SettingsLayout({ children }) {
  return (
    <div className={cx("container")}>
      <Header></Header>
      <div className={cx("wrapper")}>
          <aside className={cx("sidebar")}>
            <SidebarSettings />
          </aside>
    
          <main className={cx("content")}>{children}</main>
      </div>
      <Footer></Footer>
    </div>
  );
}
