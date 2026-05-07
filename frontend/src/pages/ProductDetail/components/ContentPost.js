import classNames from "classnames/bind";
import DOMPurify from "dompurify";
import styles from "../ProductDetail.module.scss";
import ExpandableContent from "../../../helper/ExpandableContent";

const cx = classNames.bind(styles);

export default function ContentPost({ description }) {
  const relatedPosts = [
    {
      id: 1,
      title: "Top 6 thương hiệu máy lọc nước tốt nhất 2025",
      url: "https://www.elle.vn/feature/top-6-thuong-hieu-may-loc-nuoc-tot-nhat-2025/",
      img: "https://static.elle.vn/img/6iosUIJ_lhugho_F1Gxps7py3VSgEpYfTQ2GLvkPeqg/rs:fill:600:600/quality:80/plain/http://www.elle.vn/app/uploads/2025/06/16/672110/thumb-website.jpg@webp",
      date: "28/05/2025"
    },
    {
      id: 2,
      title: "6 bước giúp bạn giảm sử dụng vật dụng bằng nhựa trong nhà bếp",
      url: "https://www.elle.vn/feature/giam-thieu-su-dong-do-nhua-trong-nha-bep/",
      img: "https://static.elle.vn/img/ck4no2LNe04eQhAZmCJ0RB2NJkvW5aInRTvXrbfWKoc/rs:fill:600:600/quality:80/plain/http://www.elle.vn/app/uploads/2024/10/09/612614/goi-y-vat-dung-nha-bep-khong-phai-lam-tu-nhua.jpg@webp",
      date: "10/10/2024"
    },
    {
      id: 3,
      title: "13 món đồ gia dụng thông minh hữu ích nhất 2025 cho mọi gia đình",
      url: "https://www.elle.vn/feature/do-gia-dung-thong-minh-huu-ich-nhat-2025/",
      img: "https://static.elle.vn/img/fdoc--_Xug-L73dAROz7MHAGbgAnjiBRHifcmrxiOMw/rs:fill:600:600/quality:80/plain/http://www.elle.vn/app/uploads/2025/05/26/667196/nhung-mon-do-gia-dung-thong-minh-2025.jpg@webp",
      date: "28/05/2025"
    }
  ];

  const handleOpenPost = (url) => {
    window.open(url, "_blank"); // mở tab mới
  };

  return (
    <div className={cx("post")}>
      <h3 className={cx("postTitle")}>Bài viết liên quan</h3>

      <div className={cx("postList")}>
        {relatedPosts.map((item) => (
          <div
            key={item.id}
            className={cx("postItem")}
            onClick={() => handleOpenPost(item.url)}
          >
            {/* ảnh */}
            <div className={cx("postImgWrap")}>
              <img src={item.img} alt={item.title} />
            </div>

            {/* content */}
            <div className={cx("postContent")}>
              <h4 className={cx("postName")}>
                {item.title}
              </h4>

              <span className={cx("postDate")}>
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}