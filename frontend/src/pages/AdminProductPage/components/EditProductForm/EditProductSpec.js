import classNames from "classnames/bind";
import styles from "./EditProductSpec.module.scss";

const cx = classNames.bind(styles);

export default function EditProductSpec({ specs = [], setFormData }) {
  const handleChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index][field] = value;

      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { specName: "", specValue: "" },
      ],
    }));
  };

  const handleRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={cx("specs")}>
      {specs.map((spec, index) => (
        <div key={index} className={cx("row")}>
          <input
            placeholder="Tên thông số"
            value={spec.specName}
            onChange={(e) =>
              handleChange(index, "specName", e.target.value)
            }
          />

          <input
            placeholder="Giá trị"
            value={spec.specValue}
            onChange={(e) =>
              handleChange(index, "specValue", e.target.value)
            }
          />

          <button onClick={() => handleRemove(index)}>✕</button>
        </div>
      ))}

      <button className={cx("addBtn")} onClick={handleAdd}>
        + Thêm thông số
      </button>
    </div>
  );
}