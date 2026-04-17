import classNames from "classnames/bind";
import styles from "./ProductTable.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";

const cx = classNames.bind(styles);

function ProductTable({ data, loading, onEdit, onView, onToggle }) {
  return (
    <div className={cx("tableWrapper")}>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Hoạt động</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            data.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.categoryName}</td>
                <td>{p.price.toLocaleString()}đ</td>

                <td>
                  <label className={cx("switch")}>
                    <input
                      type="checkbox"
                      checked={p.isActive}
                      onChange={() => onToggle(p.id)}
                    />
                    <span className={cx("slider")}></span>
                  </label>
                </td>

                <td>
                  <button
                    className={cx("btn", "btnEdit")}
                    onClick={() => onEdit(p)}
                  >
                    <AiFillEdit />
                  </button>

                  <button
                    className={cx("btn", "btnEdit")}
                    value={p.slug}
                    onClick={() => onView(p.slug)
                    }
                  >
                    <BiDetail />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
