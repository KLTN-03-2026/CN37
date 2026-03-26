import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function ProductSpecifications({ specs = [] }) {
  return (
    <div className={cx("specs")}>
      <h2>Specifications</h2>
      <table>
        <tbody>
          {specs.map(spec => (
            <tr key={spec.id}>
              <td>{spec.specName}</td>
              <td>{spec.specValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}