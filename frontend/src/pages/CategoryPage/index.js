import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CategoryPage.module.scss";

import Breadcrumb from "./components/Breadcrumb";
import CategoryHeader from "./components/CategoryHeader";
import SubCategoryTabs from "./components/SubCategoryTabs";
import BannerSlider from "./components/BannerSlider";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import { getProductfilter, getProducts } from "../../api/ProductApi";
import { getCategory } from "../../api/CategoryApi";

import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([getCategory(slug), getProducts(slug)]).then(
      ([catRes, productRes]) => {
        setCategory(catRes.data); 
        setProducts(productRes.data);
        setAllProducts(productRes.data);
        setLoading(false);
      },
    );
  }, [slug]);

  const handleFilter = async ({ brands, priceRange, sort }) => {
    const params = new URLSearchParams({
      categorySlug: slug,
      minPrice: priceRange?.[0] ?? 0,
      maxPrice: priceRange?.[1] ?? 99999999,
      brands: (brands || []).join(","), // 👈 QUAN TRỌNG
      sort: sort || "price-asc",
    });

    const res = await getProductfilter(params);

    setProducts(res.data);
  };

  if (loading)
    return <div className={cx("loadingMessage")}>Đang tải sản phẩm...</div>;

  return (
    <div className={cx("container")}>
      <Breadcrumb category={category} />

      <CategoryHeader category={category} />

      <SubCategoryTabs categories={category.children || []} />

      {category && <BannerSlider category={category} />}

      <div className={cx("main")}>
        <FilterSidebar products={products} allProducts={allProducts} onFilterChange={handleFilter} />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
