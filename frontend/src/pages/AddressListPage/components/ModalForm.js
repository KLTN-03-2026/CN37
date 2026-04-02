import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ModalForm.module.scss";

const cx = classNames.bind(styles);

export default function ModalForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    receiver_name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
    is_default: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Lấy danh sách tỉnh
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, []);

  // Load districts khi chọn province
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
      setForm((prev) => ({ ...prev, province: "", district: "", ward: "" }));
      return;
    }
    fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts || []);
        setForm((prev) => ({ ...prev, province: data.name, district: "", ward: "" }));
        setSelectedDistrict("");
        setSelectedWard("");
        setWards([]);
      })
      .catch((err) => console.error(err));
  }, [selectedProvince]);

  // Load wards khi chọn district
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      setForm((prev) => ({ ...prev, district: "", ward: "" }));
      return;
    }
    fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards || []);
        setForm((prev) => ({ ...prev, district: data.name, ward: "" }));
        setSelectedWard("");
      })
      .catch((err) => console.error(err));
  }, [selectedDistrict]);

  const handleWardChange = (e) => {
    const code = e.target.value;
    const wardObj = wards.find((w) => w.code === code);
    setSelectedWard(code);
    setForm((prev) => ({ ...prev, ward: wardObj?.name || "" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <h2 className={cx("title")}>Thêm địa chỉ mới</h2>
        <form className={cx("form")} onSubmit={handleSubmit}>
          <div className={cx("input-group")}>
            <p className={cx("form-label")}>Thông tin người nhận</p>
            <label>Họ và tên</label>
            <input
              type="text"
              name="receiver_name"
              value={form.receiver_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div className={cx("input-group")}>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              pattern="[0-9]{9,12}"
              required
            />
          </div>

          <div className={cx("divider")} />

          <div className={cx("input-group")}>
            <p className={cx("form-label")}>Địa chỉ nhận hàng</p>
            <label>Tỉnh/Thành phố</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              required
            >
              <option value="">Chọn tỉnh/thành</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className={cx("input-group")}>
            <label>Quận/Huyện</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!districts.length}
              required
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className={cx("input-group")}>
            <label>Phường/Xã</label>
            <select
              value={selectedWard}
              onChange={handleWardChange}
              disabled={!wards.length}
              required
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className={cx("input-group")}>
            <label>Địa chỉ chi tiết</label>
            <input
              type="text"
              name="address_detail"
              value={form.address_detail}
              onChange={handleChange}
              placeholder="Số nhà, tên đường"
              required
            />
          </div>

          <div className={cx("divider")} />

          <div className={cx("checkbox-group")}>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
              id="default"
              className={cx("toggle-checkbox")}
            />
            Đặt làm địa chỉ mặc định
            <label htmlFor="default" className={cx("toggle-label")}></label>
          </div>

          <div className={cx("buttons")}>
            <button type="button" className={cx("btn", "cancel")} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={cx("btn", "submit")}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}