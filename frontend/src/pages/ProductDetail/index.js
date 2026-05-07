import { useEffect, useState } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import ProductSpecifications from "./components/ProductSpecifications";
import RelatedProducts from "./components/RelatedProducts";
import Reviews from "./components/Reviews";
import ContentPost from "./components/ContentPost";

import classNames from "classnames/bind";
import styles from "./ProductDetail.module.scss";
import { getProduct } from "../../api/ProductApi";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);


export default function ProductDetail() {
  const {slug} = useParams();
  console.log(slug);
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(slug);
        setProduct(data.product);
        setRelated(data.related);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className={cx("page")}>
      <Breadcrumb product={product}/>
      <div className={cx("top-section")}>
        <div>
          <ProductGallery images={product.images} />
          <ProductSpecifications specs={product.specifications} />
        </div>
        <ProductInfo product={product} />
      </div>
      <hr></hr>
      <div className={cx("top-section")}>
        <div className={cx("left")}><ProductDescription description={product.description} /></div>
        <div className={cx("right")}><ContentPost /></div>
      </div>
      <hr></hr>
      <RelatedProducts related={related || []} />
          
      <hr></hr>
      <Reviews reviews={product.Reviews || []} /> {/* bạn có thể fetch Reviews riêng */}
    </div>
  );
}