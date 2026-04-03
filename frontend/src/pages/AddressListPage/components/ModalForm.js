import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ModalForm.module.scss";

const cx = classNames.bind(styles);

export default function ModalForm({ isOpen, onClose, onSubmit, initialData }) {
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

  // Load danh sách provinces khi mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, []);


  // Khi provinces hoặc initialData thay đổi, fill dữ liệu nếu có
  useEffect(() => {
    const fillData = async () => {
      if (!initialData || provinces.length === 0) {
        setForm({
          receiver_name: "",
          phone: "",
          province: "",
          district: "",
          ward: "",
          address_detail: "",
          is_default: false,
        });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setDistricts([]);
        setWards([]);
        return;
      }
      setForm({
        receiver_name: initialData.receiverName || "",
        phone: initialData.receiverPhone || "",
        province: initialData.province || "",
        district: initialData.district || "",
        ward: initialData.ward || "",
        address_detail: initialData.street || "",
        is_default: initialData.isDefault || false,
      });

      // tìm province code
      const provinceObj = provinces.find(
        (p) => p.name === initialData.province,
      );
      if (!provinceObj) return;
      setSelectedProvince(provinceObj.code);

      // fetch districts
      const districtRes = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceObj.code}?depth=2`,
      );
      const districtData = await districtRes.json();
      setDistricts(districtData.districts || []);

      // tìm district code
      const districtObj = districtData.districts.find(
        (d) => d.name === initialData.district,
      );
      if (!districtObj) return;
      setSelectedDistrict(districtObj.code);

      // fetch wards
      const wardRes = await fetch(
        `https://provinces.open-api.vn/api/d/${districtObj.code}?depth=2`,
      );
      const wardData = await wardRes.json();
      setWards(wardData.wards || []);

      // tìm ward code
      const wardObj = wardData.wards.find((w) => w.name === initialData.ward);
      if (wardObj) setSelectedWard(wardObj.code);
    };

    fillData();
  }, [initialData, provinces]);

  // Khi chọn province
  const handleProvinceChange = async (e) => {
    const code = Number(e.target.value);
    setSelectedProvince(code);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    const provinceObj = provinces.find((p) => p.code === code);
    setForm((prev) => ({
      ...prev,
      province: provinceObj ? provinceObj.name : "",
      district: "",
      ward: "",
    }));

    if (code) {
      const res = await fetch(
        `https://provinces.open-api.vn/api/p/${code}?depth=2`,
      );
      const data = await res.json();
      setDistricts(data.districts || []);
    }
  };

  // Khi chọn district
  const handleDistrictChange = async (e) => {
    const code = Number(e.target.value);
    setSelectedDistrict(code);
    setSelectedWard("");
    setWards([]);
    const districtObj = districts.find((d) => d.code === code);
    setForm((prev) => ({
      ...prev,
      district: districtObj ? districtObj.name : "",
      ward: "",
    }));

    if (code) {
      const res = await fetch(
        `https://provinces.open-api.vn/api/d/${code}?depth=2`,
      );
      const data = await res.json();
      setWards(data.wards || []);
    }
  };

  // Khi chọn ward
  const handleWardChange = (e) => {
    const code = Number(e.target.value);
    setSelectedWard(code);
    const wardObj = wards.find((w) => w.code === code);
    setForm((prev) => ({ ...prev, ward: wardObj ? wardObj.name : "" }));
  };

  // Các input khác
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
        <h2 className={cx("title")}>{initialData?.id ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</h2>
        <form className={cx("form")} onSubmit={handleSubmit}>
          <div className={cx("input-group")}>
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

          <div className={cx("input-group")}>
            <label>Tỉnh/Thành phố</label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
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
              onChange={handleDistrictChange}
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
            <button
              type="button"
              className={cx("btn", "cancel")}
              onClick={onClose}
            >
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
