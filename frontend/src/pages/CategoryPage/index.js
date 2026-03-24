import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CategoryPage.module.scss";

import Breadcrumb from "./components/Breadcrumb";
import CategoryHeader from "./components/CategoryHeader";
import SubCategoryTabs from "./components/SubCategoryTabs";
import BannerSlider from "./components/BannerSlider";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import { getProduct } from "../../api/CategoryApi";
import { getCategory } from "../../api/CategoryApi";

import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([getCategory(slug), getProduct(slug)]).then(
      ([catRes, productRes]) => {
        setCategory(catRes.data); // ✅ Axios dùng .data
        setProducts(productRes.data); // ✅
        setLoading(false);
      },
    );
  }, [slug]);

  if (loading) return <div className={cx("loading")}>Đang tải sản phẩm...</div>;

  return (
    <div className={cx("container")}>
      <Breadcrumb category={category} />

      <CategoryHeader category={category} />

      <SubCategoryTabs categories={category.children || []} />

      {category && <BannerSlider category={category} />}

      <div className={cx("main")}>
        <FilterSidebar />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
