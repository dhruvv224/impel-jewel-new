import React, { useLayoutEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import FilterServices from "../services/Filter";
import homeService from "../services/Home";

import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import banner_1 from "../assets/images/bg-01.jpeg";
import Ring from "../assets/images/ring.png";
import Kada from "../assets/images/kada.jpg";
import Gold_Ring from "../assets/images/gold_ring.png";
import WomansClub from "../components/common/WomansClub";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import BannerShimmer from "../shimmer/BannerShimmer";

const Home = () => {
  const firstbannerRef = useRef(null);
  const secondbannerRef = useRef(null);
  const thirdbannerRef = useRef(null);
  const fourthbannerRef = useRef(null);
  const fifthbannerRef = useRef(null);

  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
  };

  useLayoutEffect(() => {
    attemptPlay();
  }, []);

  const {
    data,
    isError,
    error,
    isLoading: isBannerLoading,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: () => homeService.banners(),
    keepPreviousData: true,
    onError: (err) => {
      console.log("Error fetching banner:", err);
    },
  });

  const bannerSlider = data?.data || [];
  const hero = Array.isArray(data?.data?.top_banners)
    ? data?.data?.top_banners
    : [];
  const middle_banners = Array.isArray(data?.data?.middle_banners)
    ? data?.data?.middle_banners
    : [];
  const bottom_banners = Array.isArray(data?.data?.bottom_banners)
    ? data?.data?.bottom_banners
    : [];

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => FilterServices.headerTags(),
    select: (data) => data?.data || [],
  });

  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => homeService.category(),
    select: (data) => data?.data || [],
  });

  const { data: newAdd } = useQuery({
    queryKey: ["recentAdd"],
    queryFn: () => homeService.RecentAdd(),
    select: (data) => data?.data || [],
  });
  const { data: review } = useQuery({
    queryKey: ["TestiMonials"],
    queryFn: () => homeService.TestiMonials(),
    select: (data) => data?.data || [],
  });

  const { data: topSell } = useQuery({
    queryKey: ["TopSelling"],
    queryFn: () => homeService.TopSelling(),
    select: (data) => data?.data || [],
  });

  return (
    <>
      <Helmet>
        <title>Impel Store - Home</title>
      </Helmet>
      <WomansClub />
      {/* Hero Banner */}
      <section className="banner position-relative">
        {isBannerLoading ? (
          <>
            <BannerShimmer />
          </>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          <>
            <Swiper
              spaceBetween={30}
              effect={"fade"}
              lazy={true}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, EffectFade, Navigation]}
              className="mySwiper"
              onSwiper={(swiper) => (firstbannerRef.current = swiper)}
            >
              <>
                {hero?.map((image, index) => {
                  return (
                    <>
                      <SwiperSlide key={index}>
                        <Link to={image?.link}>
                          <motion.img
                            className="img-fluid"
                            alt=""
                            src={image?.image}
                            style={{ objectFit: "cover" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                          />
                        </Link>
                      </SwiperSlide>
                    </>
                  );
                })}
              </>
            </Swiper>
            <div className="first_banner_button">
              <motion.button
                onClick={() => firstbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </motion.button>
              <motion.button
                onClick={() => firstbannerRef?.current?.slideNext()}
                className="next-button-swiper"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </motion.button>
            </div>
          </>
        )}
      </section>

      {/* Categories */}
      {category?.length > 0 && (
        <section className="more_categories">
          <div className="container">
            <div className="more_categories_detail">
              <h3>Browse our categories</h3>
              <Link
                to="/categories"
                className="custom-btn btn-16 mb-4"
                style={{ textDecoration: "none" }}
              >
                View All
              </Link>
            </div>
            <div className="second_banner_button">
              <button
                onClick={() => secondbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => secondbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="more_categories_slide">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 2,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={50}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => (secondbannerRef.current = swiper)}
              >
                {category?.length ? (
                  <>
                    {category?.map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                        <Link
                            to={`/categories/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            state={{ id: data.id, name: data.name }}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <div className="category_box animate__animated animate__fadeInLeft animate__delay-2s">
                              <img
                                src={data.image}
                                className="w-100"
                                alt="item_category"
                              />
                              <div className="category_name">{data.name}</div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Second Banner */}
      <section className="discover_banner">
        <div className="container">
          <div className="banner_info">
            <div className="banner_info_inr">
              <div className="banner_detail text-center">
                <div className="info_img">
                  <Link to={middle_banners[0]?.link}>
                    <img src={Ring} width="100px" alt="" />
                  </Link>
                </div>
                {middle_banners[0] ? (
                  <>
                    <Link
                      to={middle_banners[0]?.link}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: bannerSlider?.middle_banners[0]?.description,
                        }}
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Exquisite Jewelry for Everyone</h2>
                    <label></label>
                    <p>Discover our awesome rings collection</p>
                    <button className="btn discover_btn">
                      Discover The Collection
                    </button>
                  </>
                )}

                {tags && tags?.length > 0 && middle_banners[0] && (
                  <Link
                    to={middle_banners[0]?.link}
                    className="btn discover_btn"
                  >
                    Discover The Collection
                  </Link>
                )}
              </div>
            </div>
            <div className="banner_img">
              {middle_banners[0] ? (
                <Link
                  to={middle_banners[0]?.link}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={bannerSlider?.middle_banners[0]?.image}
                    className="w-100"
                    alt=""
                  />
                </Link>
              ) : (
                <Link to={middle_banners[0]?.link}>
                  <img src={banner_1} className="w-100" alt="" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newAdd?.length > 0 && (
        <section className="new_arrivals">
          <div className="container">
            <div className="new_arrival_detail">
              <h3>New Arrivals</h3>
            </div>
            <Link
              to="/latest-designs"
              className="custom-btn btn-16 mb-4"
              style={{ textDecoration: "none" }}
            >
              View All
            </Link>
            <div className="second_banner_button">
              <button
                onClick={() => thirdbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => thirdbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="new_arrival_slide">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 2,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Pagination, Navigation, Scrollbar, A11y, Autoplay]}
                spaceBetween={20}
                loop={true}
                onSwiper={(swiper) => (thirdbannerRef.current = swiper)}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                {newAdd?.length ? (
                  <>
                    {newAdd?.slice(0, 50).map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Link
                            to={`/shopdetails/${data.id}`}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <div className="profile-pic">
                              <div className="profile_img">
                                <img src={data.image} alt="" />
                              </div>

                              <div className="product_details">
                                <h4>{data.name}</h4>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Third Banner */}
      <section className="explore_banner">
        <div className="container">
          <div className="banner_info">
            <div className="banner_img">
              {bottom_banners[0] ? (
                <Link to={bottom_banners[0]?.link}>
                  <img src={bottom_banners[0]?.image} alt="" />
                </Link>
              ) : (
                <Link to={bottom_banners[0]?.link}>
                  <img src={Kada} className="w-100" alt="" />
                </Link>
              )}
            </div>
            <div className="banner_info_inr">
              <div className="banner_detail text-center">
                {bottom_banners[0] ? (
                  <>
                    <Link
                      to={bottom_banners[0]?.link}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: bannerSlider?.bottom_banners[0]?.description,
                        }}
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Exquisite Jewelry for Everyone</h2>
                    <label></label>
                    <p>Discover our awesome rings collection</p>
                    <div className="info_img_1">
                      <img src={Gold_Ring} width="150px" alt="" />
                    </div>
                    <button className="btn discover_btn">
                      Discover The Collection
                    </button>
                  </>
                )}

                {tags && tags?.length > 0 && bottom_banners[0] && (
                  <Link
                    to={bottom_banners[0]?.link}
                    className="btn discover_btn"
                  >
                    Discover The Collection
                  </Link>
                )}

                <div className="info_img">
                  <Link to={bottom_banners[0]?.link}>
                    <img src={Ring} width="100px" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top_Sellers */}
      {topSell?.length > 0 && (
        <section className="Top_sellers">
          <div className="container">
            <div className="seller_header">
              <h3>Top sellers</h3>
            </div>
            <Link
              to="/top-selling-designs"
              className="custom-btn btn-16 mb-4"
              style={{ textDecoration: "none" }}
            >
              View All
            </Link>
            <div className="second_banner_button">
              <button
                onClick={() => fourthbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => fourthbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="seller_slider">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={10}
                loop={true}
                onSwiper={(swiper) => (fourthbannerRef.current = swiper)}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                {topSell?.length ? (
                  <>
                    {topSell?.slice(0, 50).map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Link
                            to={`/shopdetails/${data.id}`}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <div className="profile-pic">
                              <img src={data.image} alt="" />
                              <div className="product_details">
                                <h4>{data.name}</h4>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* testimonials */}
      {review?.length > 0 && (
        <section className="testimonial">
          <div className="container">
            <div className="testimonial_header">
              <img
                src="https://websitedemos.net/jewellery-store-04/wp-content/uploads/sites/935/2021/08/quotation-mark.png"
                alt=""
                className="w-100"
              />
              <h3>TESTIMONIALS</h3>
            </div>
            <div className="second_banner_button">
              <button
                onClick={() => fifthbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => fifthbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="testimonial_slide">
              <Swiper
                modules={[Pagination, Scrollbar, A11y, Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                onSwiper={(swiper) => (fifthbannerRef.current = swiper)}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
              >
                <>
                  {review?.map((data, index) => (
                    <SwiperSlide key={index}>
                      <div className="testimonial_details">
                        <span>
                          <b>{data?.customer}</b>
                        </span>
                        <p>
                          <q>{data?.messsage}</q>
                        </p>
                        <img
                          className="testimonial-image"
                          src={data?.image}
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </>
              </Swiper>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
