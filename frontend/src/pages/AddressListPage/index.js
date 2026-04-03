import classNames from "classnames/bind";
import styles from "./AddressListPage.module.scss";
import ModalForm from "./components/ModalForm";
import AddressList from "./components/AddressList";
import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../api/UserAddressApi";
import { notifySuccess, notifyError } from "../../components/Nofitication";
import ConfirmDialog from "../../components/ConfirmDialog";

const cx = classNames.bind(styles);

function AddressListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // Địa chỉ đang sửa

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null); // Reset khi đóng modal
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      notifyError("Không tải được danh sách địa chỉ");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingAddress?.id) {
        // Nếu đang sửa, gọi update
        await updateAddress(editingAddress.id, data);
        notifySuccess("Cập nhật địa chỉ thành công");
        setEditingAddress(null); // Reset sau khi sửa
      } else {
        // Thêm mới
        await addAddress(data);
        notifySuccess("Thêm địa chỉ thành công");
      }
      loadAddresses();
      closeModal();
    } catch (err) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  const handleCreate = () => {
    setEditingAddress(null); // Reset khi tạo mới
    openModal();
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr); // Lưu địa chỉ đang sửa
    openModal();
  };

  const handleAskRemove = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      notifySuccess("Xóa địa chỉ thành công");
      setShowConfirm(false);
      loadAddresses();
    } catch (err) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("pageTitle")}>
        <h2 className={cx("title")}>Địa chỉ của tôi</h2>
        <button className={cx("addButton")} onClick={() => handleCreate()}>
          Thêm địa chỉ mới
        </button>
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingAddress} // Truyền dữ liệu hiện tại để sửa
      />

      <div className={cx("card")}>
        {addresses.length === 0 && (
          <div className={cx("empty")}>📭 Bạn chưa có địa chỉ nào</div>
        )}

        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleAskRemove}
        />
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Xóa địa chỉ"
        message="Bạn có chắc muốn xóa địa chỉ này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDelete(selectedId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default AddressListPage;
