import {
  Bot,
  Search,
  Truck,
  Shield,
  Sparkles,
  Headphones,
} from "lucide-react";

import styles from "./WhyChooseUs.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const features = [
  {
    icon: Bot,
    title: "AI Powered",
    description:
      "Trợ lý AI thông minh giúp bạn tìm kiếm và lựa chọn sản phẩm phù hợp nhất.",
    gradient: "purple",
  },
  {
    icon: Search,
    title: "Tìm kiếm thông minh",
    description:
      "Semantic search hiểu ý định của bạn, không cần từ khóa chính xác.",
    gradient: "blue",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description:
      "Giao hàng trong 2h tại TP.HCM và Hà Nội. Miễn phí ship đơn từ 500K.",
    gradient: "green",
  },
  {
    icon: Shield,
    title: "Bảo hành uy tín",
    description:
      "Cam kết 100% chính hãng. Bảo hành tận nhà, đổi trả trong 30 ngày.",
    gradient: "orange",
  },
  {
    icon: Sparkles,
    title: "Trải nghiệm cá nhân",
    description:
      "Gợi ý sản phẩm dựa trên sở thích và lịch sử mua hàng của bạn.",
    gradient: "pink",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description:
      "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giải đáp mọi thắc mắc.",
    gradient: "indigo",
  },
];

function WhyChooseUs() {
  return (
    <section className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Header */}
        <div className={cx("header")}>
          <h2 className={cx("title")}>
            Tại sao chọn <span>TechAI</span>?
          </h2>

          <p className={cx("subtitle")}>
            Chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến trải nghiệm mua
            sắm thông minh với công nghệ AI tiên tiến.
          </p>
        </div>

        {/* Features */}
        <div className={cx("grid")}>
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={cx("card", feature.gradient)}
              >
                <div className={cx("iconBox")}>
                  <Icon className={cx("icon")} />
                </div>

                <h3 className={cx("cardTitle")}>
                  {feature.title}
                </h3>

                <p className={cx("cardDesc")}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;