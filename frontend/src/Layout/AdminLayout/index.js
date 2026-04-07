import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarAdmin from "../components/SidebarAdmin";

const cx = classNames.bind(styles);

export default function AdminLayout({ children }) {
  return (
    <div className={cx("container")}>
      <Header></Header>
      <div className={cx("wrapper")}>
          <aside className={cx("sidebar")}>
            <SidebarAdmin />
          </aside>
    
          <main className={cx("content")}>{children}</main>
      </div>
      <Footer></Footer>
    </div>
  );
}
