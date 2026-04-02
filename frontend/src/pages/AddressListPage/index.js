import classNames from "classnames/bind";
import styles from "./AddressListPage.module.scss";
import ModalForm from "./components/ModalForm";
import { useState } from "react";

const cx = classNames.bind(styles);

function AddressListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={cx("container")}>
      <div className={cx("pageTitle")}>
        <h2 className={cx("title")}>Địa chỉ của tôi</h2>
        <button className={cx("addButton")} onClick={openModal}>
          Thêm địa chỉ mới
        </button>
      </div>
      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={(data) => console.log(data)}
      />
      <div className={cx("card")}>
        <p>Chức năng đang được phát triển...</p>
      </div>
    </div>
  );
}

export default AddressListPage;
