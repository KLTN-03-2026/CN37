import classNames from "classnames/bind";
import styles from "./BankAccountPage.module.scss";
import { useEffect, useState } from "react";

import {
  getBankAccounts,
  createBankAccount,
  deleteBankAccount,
} from "../../api/BankAccountApi";

import { notifySuccess, notifyError } from "../../components/Nofitication";
import ConfirmDialog from "../../components/ConfirmDialog";
import BankAccountList from "./components/BankAccountList";
import BankAccountModalForm from "./components/BankAccountModalForm";

const cx = classNames.bind(styles);

function BankAccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await getBankAccounts();
      setAccounts(res.data || []);
    } catch (err) {
      notifyError("Không tải được danh sách tài khoản ngân hàng");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.bankName) {
        notifyError("Vui lòng chọn ngân hàng");
        return;
      }

      if (!data.bankAccountNumber) {
        notifyError("Vui lòng nhập số tài khoản");
        return;
      }

      if (!data.bankAccountName) {
        notifyError("Vui lòng nhập tên chủ tài khoản");
        return;
      }

      await createBankAccount(data);
      notifySuccess("Thêm tài khoản ngân hàng thành công");
      closeModal();
      loadAccounts();
    } catch (err) {
      notifyError(err.response?.data || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleAskRemove = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBankAccount(id);
      notifySuccess("Xóa tài khoản ngân hàng thành công");
      setShowConfirm(false);
      loadAccounts();
    } catch (err) {
      notifyError(err.response?.data || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("pageTitle")}>
        <div>
          <h2 className={cx("title")}>Tài khoản ngân hàng</h2>
          <p className={cx("subtitle")}>
            Dùng để nhận hoàn tiền khi hủy đơn đã thanh toán.
          </p>
        </div>

        <button className={cx("addButton")} onClick={openModal}>
          Thêm tài khoản
        </button>
      </div>

      <BankAccountModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <div className={cx("card")}>
        <BankAccountList accounts={accounts} onDelete={handleAskRemove} />
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Xóa tài khoản ngân hàng"
        message="Bạn có chắc muốn xóa tài khoản ngân hàng này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDelete(selectedId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default BankAccountPage;