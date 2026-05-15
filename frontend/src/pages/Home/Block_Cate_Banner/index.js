import { useEffect, useState } from "react";

import styles from "./CateBanner.module.scss";
import classNames from "classnames/bind";

import MainBanner from "./components/MainBanner.js";
import SubBannerSlider from "./components/SubBanner.js";
import CategoryMenu from "./components/Categorymenu.js";
import InfoComponent from "./components/InfoComponent.js";
import UnderBanner from "./components/UnderBanner.js";

import WhyChooseUs from "../components/WhyChooseUs";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";

import { getProducts } from "../../../api/ProductApi";

const cx = classNames.bind(styles);

function CategoryBanner() {
  const [tvProducts, setTvProducts] = useState([]);
  const [airProducts, setAirProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // TV
      const tvRes = await getProducts("tivi-thiet-bi-hien-thi");

      // Máy lạnh
      const airRes = await getProducts("may-lanh-dieu-hoa");
      console.log("tvRes", tvRes);
      console.log("airRes", airRes);

      setTvProducts(tvRes.data || []);
      setAirProducts(airRes.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("homecontainer")}>
      <div className={cx("topSection")}>
        <CategoryMenu />

        <div className={cx("bannerGroup")}>
          <MainBanner />
          <SubBannerSlider />
        </div>

        <InfoComponent />
      </div>

      <UnderBanner />

      {/* TV */}
      <FeaturedProducts
        title="TV màn hình lớn - Giải trí ngày hè"
        slug="tivi-thiet-bi-hien-thi"
        products={tvProducts}
      />

      {/* Máy lạnh */}
      <FeaturedProducts
        title="Máy lạnh bán chạy"
        slug="may-lanh-dieu-hoa"
        products={airProducts}
      />

      <CategoryGrid />

      <WhyChooseUs />
    </div>
  );
}

export default CategoryBanner;
