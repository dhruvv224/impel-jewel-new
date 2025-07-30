import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { FcLike } from "react-icons/fc";
import {
  FaFilePdf,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaRegFilePdf,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Select from "react-select";
import Accordion from "react-bootstrap/Accordion";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import ShopServices from "../../services/Shop";
import FilterServices from "../../services/Filter";
import DealerWishlist from "../../services/Dealer/Collection";
import DealerPdf from "../../services/Dealer/PdfShare";
import UserWishlist from "../../services/Auth";
import { WishlistSystem } from "../../context/WishListContext";
import { motion } from "framer-motion";

const Shop = () => {
  const { dispatch: wishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);

  const location = useLocation();
  const navigate = useNavigate();

  const userType = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");
  const Phone = localStorage.getItem("phone");

  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [paginate, setPaginate] = useState();
  const [searchInput, setSearchInput] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genderData, setGenderData] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [filterTag, setFilterTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [PriceRange, setPriceRange] = useState({
    minprice: null,
    maxprice: null,
  });
  const [FilterPriceRange, setFilterPriceRange] = useState({
    minprice: 0,
    maxprice: 0,
  });
  const [DealerCollection, setDealerCollection] = useState([]);
  const [UsercartItems, setUserCartItems] = useState([]);
  const [pdfItems, setPdfItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 40,
  });

  const totalPages = Math.ceil(paginate / pagination?.dataShowLength);
  const { tag_id } = location.state || {};

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [options] = useState([
    { value: "new_added", label: "New Added" },
    { value: "low_to_high", label: "Price: low to high" },
    { value: "high_to_low", label: "Price: high to low" },
    { value: "highest_selling", label: "Top Seller" },
  ]);

  const searchbar = (e) => {
    setIsLoading(true);
    const searchedText = e.target.value.toUpperCase();
    setSearchInput(searchedText);
    const queryParams = new URLSearchParams(location.search);
    if (searchedText?.length > 0) {
      queryParams.delete("page");
      queryParams.set("search", searchedText);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    } else {
      queryParams.delete("search");
    }
    navigate(
      `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
  };

  const handleSelectCategory = (categoryId) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    setSelectedOption(null);
    setSelectedGender(null);
    setSelectedTag(null);
    setPriceRange({ minprice: null, maxprice: null });
    queryParams.delete("search");
    queryParams.delete("gender_id");
    queryParams.delete("tag_id");
    queryParams.delete("sort_by");
    queryParams.delete("min_price");
    queryParams.delete("max_price");

    if (categoryId) {
      queryParams.set("category_id", categoryId.value);
    } else {
      queryParams.delete("category_id");
    }

    navigate(
      `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    setSelectedCategory(categoryId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectChange = (selectedSort) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    if (selectedSort) {
      queryParams.set("sort_by", selectedSort.value);
    } else {
      queryParams.delete("sort_by");
    }
    navigate(`/shop?${queryParams.toString()}`);
    setSelectedOption(selectedSort);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectGender = (genderId) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    if (genderId) {
      queryParams.set("gender_id", genderId.value);
    } else {
      queryParams.delete("gender_id");
    }
    navigate(`/shop?${queryParams.toString()}`);
    setSelectedGender(genderId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectTag = (selectedTags) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    if (selectedTags) {
      queryParams.set("tag_id", selectedTags.value);
    } else {
      queryParams.delete("tag_id");
    }
    navigate(`/shop?${queryParams.toString()}`);
    setSelectedTag(selectedTags);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSliderChange = (e) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    queryParams.set("min_price", e[0]);
    queryParams.set("max_price", e[1]);
    navigate(`/shop?${queryParams.toString()}`);
    setPriceRange({ minprice: e[0], maxprice: e[1] });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const FilterData = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const currentPageNo = parseInt(queryParams.get("page")) || 1;
    const currentCategory = queryParams.get("category_id");
    const currentSearch = queryParams.get("search");
    const currentSort = queryParams.get("sort_by");
    const currentGender = queryParams.get("gender_id");
    const currentTag = queryParams.get("tag_id");
    const currentMinPrice = queryParams.get("min_price");
    const currentMaxPrice = queryParams.get("max_price");

    if (currentPageNo) {
      setPagination((prev) => ({ ...prev, currentPage: currentPageNo }));
    } else {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }

    try {
      const filterResponse = await ShopServices.allfilterdesigns({
        category_id: Number(currentCategory) || null,
        gender_id: Number(currentGender) || null,
        tag_id: Number(tag_id) || null,
        search: currentSearch,
        min_price: Number(currentMinPrice) || null,
        max_price: Number(currentMaxPrice) || null,
        sort_by: currentSort || selectedOption?.value || null,
        userType: Number(userType),
        userId: Number(userId),
        page: currentPageNo,
      });
      setIsLoading(false);
      setFilterData(filterResponse?.data?.designs || []);
      setFilterTag(filterResponse?.data?.tags || []);
      setPaginate(filterResponse?.data?.total_records || {});
      setFilterPriceRange({
        minprice: filterResponse?.data?.minprice || 0,
        maxprice: filterResponse?.data?.maxprice || 0,
      });

      const categoryRes = await FilterServices.categoryFilter();
      setCategoryData(categoryRes?.data || []);

      const genderRes = await FilterServices.genderFilter();
      setGenderData(genderRes?.data || []);

      if (currentSearch) {
        setSearchInput(currentSearch);
      } else {
        setSearchInput(null);
      }

      if (categoryRes?.data && currentCategory) {
        const Category_ids = categoryRes?.data?.find(
          (item) => item?.id === Number(currentCategory)
        );
        setSelectedCategory(
          Category_ids
            ? { value: Category_ids.id, label: Category_ids.name }
            : null
        );
      } else {
        setSelectedCategory(null);
      }

      if (options && currentSort) {
        const selectedSort = options?.find(
          (item) => item?.value === currentSort
        );
        setSelectedOption(selectedSort);
      } else {
        setSelectedOption(null);
      }

      if (genderRes?.data && currentGender) {
        const Gender_ids = genderRes?.data?.find(
          (item) => item?.id === Number(currentGender)
        );
        setSelectedGender({
          value: Gender_ids.id,
          label: Gender_ids.name,
        });
      } else {
        setSelectedGender(null);
      }

      if (filterResponse?.data?.tags && currentTag) {
        const selectedTagID = filterResponse?.data?.tags?.find(
          (item) => item?.id === Number(currentTag)
        );
        setSelectedTag({
          value: selectedTagID?.id,
          label: selectedTagID?.name,
        });
      } else {
        setSelectedTag(null);
      }

      if (
        (filterResponse?.data?.minprice && currentMinPrice) ||
        currentMaxPrice
      ) {
        const selectedPrice = {
          minprice:
            filterResponse?.data?.minprice !== null
              ? parseFloat(filterResponse?.data?.minprice)
              : FilterPriceRange.minprice,
          maxprice:
            filterResponse?.data?.maxprice !== null
              ? parseFloat(filterResponse?.data?.maxprice)
              : FilterPriceRange.maxprice,
        };
        setPriceRange(selectedPrice);
      } else {
        setPriceRange({ minprice: null, maxprice: null });
      }
    } catch (err) {
      console.error("Error fetching filter data:", err);
      setIsLoading(true);
    }
  };

  const updatePagination = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate(`/shop?${queryParams.toString()}`);
    setPagination((prev) => ({ ...prev, currentPage: page }));
    setIsLoading(true);
    scrollup();
  };

  const paginationPrev = (e) => {
    if (pagination.currentPage > 1) {
      e.preventDefault();
      updatePagination(pagination.currentPage - 1);
      scrollup();
    }
  };

  const paginationNext = (e) => {
    if (pagination.currentPage < totalPages) {
      e.preventDefault();
      updatePagination(pagination.currentPage + 1);
      scrollup();
    }
  };

  useEffect(() => {
    FilterData();
  }, [location.search]);

  const GetUserWishList = async () => {
    UserWishlist.userWishlist({ phone: Phone })
      .then((res) => {
        setUserCartItems(res?.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addToUserWishList = async (e, product) => {
    e.preventDefault();
    const payload = { id: product?.id };
    if (!UsercartItems.some((item) => item.id === product.id)) {
      UserWishlist.addtoWishlist({
        phone: Phone,
        design_id: product.id,
        gold_color: "yellow_gold",
        gold_type: "18k",
        design_name: product?.name,
      })
        .then((res) => {
          if (res.success === true) {
            toast.success("Design has been Added to Your Wishlist");
            GetUserWishList();
            wishlistDispatch({
              type: "ADD_TO_WISHLIST",
              payload,
            });
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  };

  const removeFromWishList = (e, product) => {
    e.preventDefault();
    const payload = product;
    UserWishlist.removetoWishlist({
      phone: Phone,
      design_id: product.id,
      gold_color: "yellow_gold",
      gold_type: "18k",
      design_name: product?.name,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success("Design has been Removed from Your Wishlist.");
          GetUserWishList();
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetDealerSelection = () => {
    DealerWishlist.ListCollection({ email: email })
      .then((res) => {
        setDealerCollection(res.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddToDealerSelection = async (e, product) => {
    e.preventDefault();
    if (!DealerCollection?.some((item) => item.id === product?.id)) {
      DealerWishlist.addtoDealerWishlist({
        email: email,
        design_id: product?.id,
      })
        .then((res) => {
          if (res.success === true) {
            toast.success("Design has been Added to Your Collection.");
            FilterData();
            GetDealerSelection();
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  };

  const removeFromSelection = (e, product) => {
    e.preventDefault();
    DealerWishlist.removetodealerWishlist({
      email: localStorage.getItem("email"),
      design_id: product.id,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          FilterData();
          GetDealerSelection();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPdfList = async () => {
    DealerPdf.pdfList({ email: email })
      .then((res) => {
        setPdfItems(res?.data?.pdf_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (Phone) {
      GetUserWishList();
    }

    if (email) {
      GetDealerSelection();
      getPdfList();
    }
  }, []);

  const addToPDF = async (e, product) => {
    e.preventDefault();
    if (!pdfItems.some((item) => item.id === product.id)) {
      DealerPdf.addToPdf({
        email: email,
        design_id: product.id,
      })
        .then((res) => {
          getPdfList();
          toast.success(res.message);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  };

  const removeToPDF = (e, product) => {
    e.preventDefault();
    DealerPdf.removePdf({
      email: email,
      design_ids: [product.id],
    })
      .then((res) => {
        if (res.success === true) {
          getPdfList();
          toast.success(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const UserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/login");
  };

  const DealerLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/dealer-login");
  };

  const wishlistTip = <Tooltip id="tooltip">wishlist</Tooltip>;
  const selectionTip = <Tooltip id="tooltip">My Selections</Tooltip>;
  const pdfTip = <Tooltip id="tooltip">My PDF share</Tooltip>;
  const userTip = (
    <Tooltip id="tooltip">Login to add wishlist products</Tooltip>
  );

  const shimmerItems = Array(20).fill(null);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  return (
    <>
      <Helmet>
        <title>Impel Store - Shop</title>
      </Helmet>
      <section className="shop">
        <div className="container">
          <div className="shopping_data">
            <div className="row">
              <div className="col-lg-9 col-md-6 col-12 mb-lg-3 mb-md-3 mb-2">
                <Select
                  placeholder="Shop by category"
                  isClearable={true}
                  isSearchable={false}
                  value={selectedCategory}
                  options={categoryData.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectCategory}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-3 mb-md-3 mb-2">
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  isClearable={true}
                  isSearchable={false}
                  options={options}
                  placeholder="Sort By"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-3 mb-2">
                <div className="search_bar">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search by design code"
                    value={searchInput}
                    onChange={(e) => searchbar(e)}
                    isClearable={true}
                  />
                  {searchInput && searchInput.length >= 1 ? null : (
                    <BsSearch className="search-icon cursor-pointer" />
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-3 mb-2">
                <Select
                  placeholder="Shop by Gender"
                  isClearable
                  isSearchable={false}
                  value={selectedGender}
                  options={genderData?.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectGender}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-5 mb-2">
                <Select
                  placeholder="Shop by Tag"
                  isClearable
                  isSearchable={false}
                  value={selectedTag}
                  options={filterTag?.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectTag}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-5 mb-4">
                <Accordion className="accordian">
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Shop by price</Accordion.Header>
                    <Accordion.Body className="p-4 mb-2">
                      <div className="d-flex justify-content-between">
                        <p>
                          From :
                          <strong>
                            ₹
                            {PriceRange?.minprice
                              ? PriceRange?.minprice
                              : FilterPriceRange.minprice}
                          </strong>
                        </p>
                        <p>
                          To :
                          <strong>
                            ₹
                            {PriceRange?.maxprice
                              ? PriceRange?.maxprice
                              : FilterPriceRange.maxprice}
                          </strong>
                        </p>
                      </div>
                      <Slider
                        range
                        allowCross={false}
                        min={FilterPriceRange.minprice}
                        max={FilterPriceRange.maxprice}
                        marks={{
                          [FilterPriceRange?.minprice]: "Min",
                          [FilterPriceRange?.maxprice]: "Max",
                        }}
                        onAfterChange={handleSliderChange}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>

            {isLoading ? (
              <>
                <div className="row">
                  {shimmerItems.map((_, index) => (
                    <div className="col-lg-3 col-md-6 col-12">
                      <div key={index} className="shimmer-product">
                        <div className="shimmer-image"></div>
                        <div className="shimmer-price"></div>
                        <div className="shimmer-price"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-12">
                    {filterData?.length > 0 ? (
                      <>
                        <div className="row">
                          {filterData?.map((data) => {
                            return (
                              <>
                                <div className="col-lg-3 col-md-6 col-12">
                                  <motion.div
                                    className="item-product text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Link to={`/shopdetails/${data?.id}`}>
                                      <div className="product-thumb">
                                        {data?.image ? (
                                          <>
                                            <motion.img
                                              src={data?.image}
                                              alt=""
                                              className="w-100"
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              transition={{ duration: 0.5 }}
                                              whileHover={{ scale: 1.05 }}
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <img
                                              src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                                              alt=""
                                              className="w-100"
                                            />
                                          </>
                                        )}
                                      </div>
                                      <div className="product-info">
                                        {/* <h4>
                                          {data?.name}&nbsp;
                                          <span>({data?.code})</span>
                                        </h4> */}

                                        <div className="product-info d-grid">
                                          {(data?.making_charge_discount_18k >
                                            0 &&
                                            Phone) ||
                                          (email && userId) ? (
                                            <>
                                              <del style={{ color: "#000" }}>
                                                ₹
                                                {numberFormat(
                                                  data?.making_charge_18k +
                                                    data?.metal_value_18k
                                                )}
                                              </del>
                                              <label>
                                                <strong className="text-success">
                                                  ₹
                                                  {numberFormat(
                                                    data?.metal_value_18k +
                                                      data?.making_charge_discount_18k
                                                  )}
                                                </strong>
                                              </label>
                                            </>
                                          ) : (
                                            <strong className="text-success">
                                              ₹
                                              {Phone && userId ? (
                                                <>
                                                  {numberFormat(
                                                    data?.total_amount_18k
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {numberFormat(
                                                    data?.making_charge_18k +
                                                      data?.metal_value_18k
                                                  )}
                                                </>
                                              )}
                                            </strong>
                                          )}
                                        </div>

                                        {/* <label>
                                          ₹
                                          {numberFormat(data?.total_amount_18k)}
                                        </label> */}
                                      </div>
                                      {userType == 1 && (
                                        <div className="mt-1">
                                          <span
                                            style={{
                                              color: "#db9662",
                                              fontWeight: 700,
                                            }}
                                          >
                                            {data?.code}
                                          </span>
                                        </div>
                                      )}
                                    </Link>
                                    <div className="wishlist-top">
                                      {userType == 1 ? (
                                        <>
                                          {email ? (
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={selectionTip}
                                            >
                                              <Link
                                                to="#"
                                                className="dealer_heart_icon"
                                                onClick={(e) => {
                                                  if (
                                                    DealerCollection?.find(
                                                      (item) =>
                                                        item?.id === data?.id
                                                    )
                                                  ) {
                                                    removeFromSelection(
                                                      e,
                                                      data
                                                    );
                                                  } else {
                                                    AddToDealerSelection(
                                                      e,
                                                      data
                                                    );
                                                  }
                                                }}
                                              >
                                                {DealerCollection?.find(
                                                  (item) =>
                                                    item?.id === data?.id
                                                ) ? (
                                                  <FaStar />
                                                ) : (
                                                  <FaRegStar />
                                                )}
                                              </Link>
                                            </OverlayTrigger>
                                          ) : (
                                            <span
                                              onClick={(e) => DealerLogin(e)}
                                            >
                                              <FaRegStar />
                                            </span>
                                          )}
                                          {email ? (
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={pdfTip}
                                            >
                                              <Link
                                                to="#"
                                                className="dealer_heart_icon"
                                                onClick={(e) => {
                                                  if (
                                                    pdfItems?.find(
                                                      (item) =>
                                                        item?.id === data?.id
                                                    )
                                                  ) {
                                                    removeToPDF(e, data);
                                                  } else {
                                                    addToPDF(e, data);
                                                  }
                                                }}
                                              >
                                                {pdfItems?.find(
                                                  (item) =>
                                                    item?.id === data?.id
                                                ) ? (
                                                  <FaFilePdf />
                                                ) : (
                                                  <FaRegFilePdf />
                                                )}
                                              </Link>
                                            </OverlayTrigger>
                                          ) : (
                                            <span
                                              onClick={(e) => DealerLogin(e)}
                                            >
                                              <FaRegFilePdf />
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {Phone ? (
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={wishlistTip}
                                            >
                                              <Link
                                                to="#"
                                                className=""
                                                onClick={(e) => {
                                                  if (
                                                    UsercartItems?.find(
                                                      (item) =>
                                                        item.id === data.id
                                                    )
                                                  ) {
                                                    removeFromWishList(e, data);
                                                  } else {
                                                    addToUserWishList(e, data);
                                                  }
                                                }}
                                              >
                                                {UsercartItems?.find(
                                                  (item) => item.id === data.id
                                                ) ? (
                                                  <FcLike />
                                                ) : (
                                                  <FiHeart />
                                                )}
                                              </Link>
                                            </OverlayTrigger>
                                          ) : (
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={userTip}
                                            >
                                              <span
                                                className=""
                                                onClick={(e) => UserLogin(e)}
                                              >
                                                <FiHeart
                                                  style={{
                                                    fontSize: "22px",
                                                  }}
                                                />
                                              </span>
                                            </OverlayTrigger>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </motion.div>
                                </div>
                              </>
                            );
                          })}
                        </div>

                        <div className="pt-5">
                          {totalPages > 1 && (
                            <div className="paginationArea">
                              <nav aria-label="navigation">
                                <ul className="pagination">
                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === 1
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      to="#"
                                      className="page-link d-flex align-items-center gap-2"
                                      onClick={paginationPrev}
                                    >
                                      <FaLongArrowAltLeft />
                                      Prev
                                    </Link>
                                  </li>

                                  {Array.from({ length: totalPages }).map(
                                    (_, index) => {
                                      const pageNumber = index + 1;
                                      const isCurrentPage =
                                        pagination.currentPage === pageNumber;

                                      return pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >=
                                          pagination.currentPage - 1 &&
                                          pageNumber <=
                                            pagination.currentPage + 1) ? (
                                        <li
                                          key={pageNumber}
                                          className={`page-item ${
                                            isCurrentPage ? "active" : ""
                                          }`}
                                          onClick={() =>
                                            updatePagination(pageNumber)
                                          }
                                        >
                                          <Link
                                            to="#"
                                            className="page-link"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            {pageNumber}
                                          </Link>
                                        </li>
                                      ) : index === 1 ||
                                        index === totalPages - 2 ? (
                                        <li
                                          key={pageNumber}
                                          className="page-item disabled"
                                        >
                                          <Link
                                            to="#"
                                            className="page-link"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            ...
                                          </Link>
                                        </li>
                                      ) : null;
                                    }
                                  )}

                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === totalPages
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      to="#"
                                      className="page-link d-flex align-items-center gap-2"
                                      onClick={paginationNext}
                                    >
                                      Next
                                      <FaLongArrowAltRight />
                                    </Link>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="not-products">
                        <p>No products available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
