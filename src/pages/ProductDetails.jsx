import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../redux/slices/cartSlice";
import size from "../assets/data/sizeArr";
import axios from "axios";
import SizeModal from "../components/UI/SizeModal";
import SelectQuantity from "../components/UI/SelectQuantity";
import bannernho from "../assets/images/banner-nho.png";
import { sendEmail } from "../api/email";

const ProductDetails = () => {
  const dispatch = useDispatch();

  //
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  //
  const [tab, setTab] = useState("desc");
  const [rating, setRating] = useState(null);
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const reviewEmail = useRef("");
  const { id } = useParams();
  const [reviews, setReviews] = useState([
    { 
      rating: 4.6, 
      text: "sản phẩm đẹp", 
      user: "Khánh", 
      email: "khanh@example.com", 
      likes: 0, 
      isLiked: false,
      replies: []
    },
  ]);
  const [item, setItem] = useState({});
  const allProducts = useSelector((state) => state.managerProduct?.products);
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:8080/api/products/${id}`);
      setItem(res.data.data);
    };
    fetchProduct();
  }, [id]);

  const { imgUrl, productName, productPrice, category } = item;
  const relatedProducts = allProducts?.filter(
    (data) => data.category === item?.category && data.id !== item?.id
  );
  const addToCart = () => {
    if (sizeChoice === undefined) {
      toast.error("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }
    dispatch(
      cartActions.addItem({
        id: item?.id,
        productName: item.name || item?.productName,
        price: item.retail_price_cents || item?.productPrice,
        imgUrl: item?.grid_picture_url || item?.imgUrl,
        quantity: quantity,
        size: sizeChoice,
      })
    );
    toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
    navigate("/cart");
  };

  const navigate = useNavigate();
  const buyNow = () => {
    dispatch(
      cartActions.addItem({
        id: item?.id,
        productName: item.name || item?.productName,
        price: item.retail_price_cents || item?.productPrice,
        imgUrl: item?.grid_picture_url || item?.imgUrl,
        quantity: quantity,
        size: sizeChoice !== undefined ? sizeChoice : 40,
      })
    );
    navigate("/checkout");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;
    const reviewUserEmail = reviewEmail.current.value;
    const reviewObj = {
      user: reviewUserName,
      text: reviewUserMsg,
      rating,
      email: reviewUserEmail,
      likes: 0,
      isLiked: false
    };
    setReviews([...reviews, reviewObj]);
    toast.success("Đánh giá đã được gửi");
  
    // Gửi email
    try {
      await sendEmail({
        to: "admin@example.com", // Địa chỉ email nhận đánh giá
        subject: `Đánh giá sản phẩm từ ${reviewUserName}`,
        message: `Số sao: ${rating}\nNội dung: ${reviewUserMsg}\nEmail: ${reviewUserEmail}`,
      });
    } catch (error) {
      toast.error("Gửi email thất bại!");
    }
  };

  const handleLike = (index) => {
    const updatedReviews = [...reviews];
    if (!updatedReviews[index].isLiked) {
      updatedReviews[index].likes += 1;
      updatedReviews[index].isLiked = true;
    } else {
      updatedReviews[index].likes -= 1;
      updatedReviews[index].isLiked = false;
    }
    setReviews(updatedReviews);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [item]);
  const [selectIdx, setSelectIdx] = useState(-1);
  const [sizeChoice, setSizeChoice] = useState();

  // handle quantity
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity]
  );

  const [replyingTo, setReplyingTo] = useState(null);
  const replyText = useRef("");
  const replyUser = useRef("");
  const replyEmail = useRef("");

  const handleReply = (index) => {
    setReplyingTo(index);
  };

  const submitReply = (e, reviewIndex) => {
    e.preventDefault();
    const replyUserName = replyUser.current.value;
    const replyUserMsg = replyText.current.value;
    const replyUserEmail = replyEmail.current.value;

    const replyObj = {
      user: replyUserName,
      text: replyUserMsg,
      email: replyUserEmail,
      timestamp: new Date().toLocaleString()
    };

    const updatedReviews = [...reviews];
    updatedReviews[reviewIndex].replies.push(replyObj);
    setReviews(updatedReviews);
    setReplyingTo(null);
    
    // Clear form
    replyUser.current.value = "";
    replyText.current.value = "";
    replyEmail.current.value = "";
    
    toast.success("Phản hồi đã được gửi");
  };

  return (
    <Helmet title={productName}>
      <img src={bannernho} alt="banner-nho" />
      <section>
        <div style={{ marginLeft: "300px" }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link style={{ color: "blue" }} to="/home">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link style={{ color: "blue" }} to="/shop">
                Shop
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{item?.productName}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Container>
          <Row>
            <Col lg="6">
              <img src={imgUrl} className="product__detail-img" alt="product" />
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-half-s-line"></i>
                    </span>
                  </div>
                  <p className="pd__icons">
                    <FaFacebook />
                    <FaInstagram className="mx-2" />
                    <FiMessageCircle />
                  </p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">
                    {item.productPrice?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <span>Thể loại: {item.category}</span>
                </div>
                <div className="mt-4">
                  <div className="pd">
                    <div className="pd__info">
                      <h5>GIAO HÀNG TOÀN QUỐC</h5>
                      <p>Thanh toán COD</p>
                    </div>
                    <div className="pd__info">
                      <h5>CÓ SẴN TẠI CỬA HÀNG</h5>
                      <p>Giao ngay trong ngày</p>
                    </div>
                    <div className="pd__info">
                      <h5>ĐỔI TRẢ DỄ DÀNG</h5>
                      <p>Khi không vừa size</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="pd__ship">
                    <p>Giao hàng toàn quốc từ HCM:</p>
                    <ul>
                      <li>+35.000đ. Nhận hàng sau 2-4 ngày.</li>
                      <li>Miễn phí cho đơn hàng trên 1.000.000đ</li>
                      <li>
                        Giao gấp trong 1h khu vực HCM, phí +10.000đ (tuỳ khu
                        vực)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="size mt-3">
                  <h6>Size</h6>
                  <div className="size-arr">
                    {size?.map((item, idx) => {
                      return (
                        <>
                          <span
                            key={idx}
                            onClick={() => {
                              if (idx !== selectIdx) {
                                setSelectIdx(idx);
                                setSizeChoice(item);
                              } else {
                                setSelectIdx(-1);
                                setSizeChoice();
                              }
                            }}
                            className={`mx-2 size-grid ${
                              selectIdx === idx ? "size-active" : ""
                            } `}
                          >
                            {item}
                          </span>
                        </>
                      );
                    })}
                  </div>
                </div>
                <div
                  className="mt-5"
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => setModal(true)}
                >
                  Bảng Quy Đổi Kích Cỡ{" >"}{" "}
                </div>
                <SizeModal modal={modal} toggle={toggle} />
                {/*  */}
                <div className="mt-5 select-container">
                  <div>Số lượng</div>
                  <div className="d-flex mx-5 gap-5">
                    <SelectQuantity
                      quantity={quantity}
                      handleQuantity={handleQuantity}
                      handleChangeQuantity={handleChangeQuantity}
                    />
                    <span>{item?.quantity} sản phẩm có sẵn</span>
                  </div>
                  <div></div>
                </div>
                {/*  */}
                <div className="buy-add">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn"
                    onClick={addToCart}
                  >
                    Thêm vào giỏ hàng
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn"
                    style={{ backgroundColor: "#fb6e2e" }}
                    onClick={buyNow}
                  >
                    Mua ngay
                  </motion.button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Mô tả
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Đánh giá ({1})
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{item?.description}</p>
                </div>
              ) : (
                <div className="product__review">
                  <div className="review__wrapper">
                    <ul>
                      {reviews.map((item, idx) => (
                        <li key={idx} className="rv-info">
                          <a href="#">
                            <img
                              src="https://react.semantic-ui.com/images/avatar/small/matt.jpg"
                              alt="avt"
                            />
                          </a>
                          <div className="rv-content">
                            <p>{item.user}</p>
                            <span>Đánh giá {item.rating}</span>
                            <p>{item.text}</p>
                            <p>Email: {item.email}</p>

                            <div className="rv-react">
                              <motion.p 
                                whileHover={{ scale: 1.1 }} 
                                onClick={() => handleLike(idx)}
                                style={{ 
                                  color: item.isLiked ? '#007bff' : 'inherit',
                                  cursor: 'pointer'
                                }}
                              >
                                Thích ({item.likes})
                              </motion.p>
                              <motion.p 
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleReply(idx)}
                                style={{ cursor: 'pointer' }}
                              >
                                Trả lời
                              </motion.p>
                            </div>

                            {/* Display Replies */}
                            {item.replies && item.replies.length > 0 && (
                              <div className="replies-section" style={{ marginLeft: '20px', marginTop: '10px' }}>
                                {item.replies.map((reply, replyIdx) => (
                                  <div key={replyIdx} className="reply-item" style={{ 
                                    borderLeft: '2px solid #007bff',
                                    paddingLeft: '10px',
                                    marginTop: '10px'
                                  }}>
                                    <p style={{ fontWeight: 'bold' }}>{reply.user}</p>
                                    <p>{reply.text}</p>
                                    <p style={{ fontSize: '0.8em', color: '#666' }}>{reply.timestamp}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === idx && (
                              <div className="reply-form" style={{ marginTop: '10px', marginLeft: '20px' }}>
                                <form onSubmit={(e) => submitReply(e, idx)}>
                                  <div className="form__group">
                                    <input
                                      type="text"
                                      placeholder="Nhập tên của bạn"
                                      ref={replyUser}
                                      required
                                    />
                                  </div>
                                  <div className="form__group">
                                    <input
                                      type="email"
                                      placeholder="Nhập email của bạn"
                                      ref={replyEmail}
                                      required
                                    />
                                  </div>
                                  <div className="form__group">
                                    <textarea
                                      rows={2}
                                      type="text"
                                      placeholder="Nhập phản hồi của bạn..."
                                      ref={replyText}
                                      required
                                    />
                                  </div>
                                  <div className="d-flex gap-2">
                                    <motion.button
                                      whileTap={{ scale: 1.2 }}
                                      type="submit"
                                      className="buy__btn"
                                      style={{ padding: '5px 15px' }}
                                    >
                                      Gửi phản hồi
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 1.2 }}
                                      type="button"
                                      className="buy__btn"
                                      style={{ padding: '5px 15px', backgroundColor: '#dc3545' }}
                                      onClick={() => setReplyingTo(null)}
                                    >
                                      Hủy
                                    </motion.button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="review__form">
                      <h4>Để lại lời nhắn</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Nhập tên của bạn"
                            ref={reviewUser}
                            required
                          />
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.span
                              key={star}
                              whileTap={{ scale: 1.2 }}
                              onClick={() => setRating(star)}
                              style={{
                                cursor: 'pointer',
                                color: rating >= star ? '#ffc107' : '#e4e5e9',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                padding: '5px',
                                borderRadius: '5px',
                                transition: 'all 0.2s ease',
                                backgroundColor: rating === star ? 'rgba(255, 193, 7, 0.1)' : 'transparent'
                              }}
                            >
                              {star}
                              <i 
                                className="ri-star-s-fill"
                                style={{
                                  fontSize: '1.2rem'
                                }}
                              />
                            </motion.span>
                          ))}
                        </div>
                        <div className="form__group">
                          <textarea
                            rows={4}
                            type="text"
                            placeholder="Để lại lời nhắn..."
                            ref={reviewMsg}
                            required
                          />
                        </div>
                        <div className="form__group">
                          <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            ref={reviewEmail}
                            required
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="buy__btn"
                        >
                          Xác nhận
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="12" className="mt-5">
              <h2 className="related__title">Có thể bạn thích</h2>
            </Col>
            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
