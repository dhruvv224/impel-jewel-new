import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaFilePdf,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaRegFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Select from "react-select";
import profileService from "../../services/Home";
import DealerPdf from "../../services/Dealer/PdfShare";
import { Helmet } from "react-helmet-async";

const imageURL = process.env.REACT_APP_API_KEY_IMAGE_;

const ReadytoDispatch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const JewelleryType = [
    {
      id: "4",
      name: "Silver",
    },
    {
      id: "1,5",
      name: "Gold",
    },
  ];

  const userType = localStorage.getItem("user_type");
  const email = localStorage.getItem("email");
  const user_id = localStorage.getItem("user_id");
  const debounceTimeout = useRef(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [totalItems, setTotalItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tagNoChange, setTagNoChange] = useState(null);

  const [companyId, setCompanyId] = useState(null);

  const [selectedSizes, setSelectedSizes] = useState(null);

  const [selectedItemGroups, setSelectedItemGroups] = useState(null);

  const [selectedItems, setSelectedItems] = useState(null);

  const [selectedSubItems, setSelectedSubItems] = useState(null);

  const [selectedStyles, setSelectedStyles] = useState(null);

  const [masterGroups, setMasterGroups] = useState([]);

  const [allPrices, setAllPrices] = useState([]);

  const [pdfItems, setPdfItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 20,
  });

  const totalPages = Math.ceil(totalItems / pagination?.dataShowLength);

  const handleSearchItems = useCallback((e) => {
    setTagNoChange(e.target.value);
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setIsLoading(true);
      const searchedText = e.target.value.toUpperCase();
      const queryParams = new URLSearchParams(location.search);

      if (searchedText?.length > 0) {
        queryParams.delete("page");
        queryParams.set("search", searchedText);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        queryParams.delete("search");
      }

      navigate(
        `/ready-to-dispatch${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`
      );
    }, 1000);
  }, []);

  const handleItems = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");

    if (selectedOption) {
      queryParams.set("items", selectedOption.value);
    } else {
      queryParams.delete("items");
    }

    navigate(
      `/ready-to-dispatch${queryParams ? `?${queryParams.toString()}` : ""}`
    );

    setSelectedItems(selectedOption);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSubItems = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");

    if (selectedOption) {
      queryParams.set("sub-items", selectedOption.value);
    } else {
      queryParams.delete("sub-items");
    }

    navigate(
      `/ready-to-dispatch${queryParams ? `?${queryParams.toString()}` : ""}`
    );

    setSelectedSubItems(selectedOption);
  };

  const handleSizes = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");
    if (selectedOption) {
      queryParams.set("sizes", selectedOption.value);
    } else {
      queryParams.delete("sizes");
    }

    navigate(
      `/ready-to-dispatch${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
    setSelectedSizes(selectedOption);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleCompanyId = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");
    if (selectedOption) {
      queryParams.set("companyId", selectedOption.value);
    } else {
      queryParams.delete("companyId");
    }

    let queryString = queryParams.toString().replace(/%2C/g, ",");

    navigate(`/ready-to-dispatch${queryString ? `?${queryString}` : ""}`);
    setCompanyId(selectedOption);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectedStyle = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");

    if (selectedOption) {
      queryParams.set("styles", selectedOption.value);
    } else {
      queryParams.delete("styles");
    }

    navigate(
      `/ready-to-dispatch${queryParams ? `?${queryParams.toString()}` : ""}`
    );

    setSelectedStyles(selectedOption);
  };

  const handleSelectedItemGroup = (selectedOption) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);

    queryParams.delete("page");

    if (selectedOption) {
      queryParams.set("item-group", selectedOption.value);
    } else {
      queryParams.delete("item-group");
    }

    navigate(
      `/ready-to-dispatch${queryParams ? `?${queryParams.toString()}` : ""}`
    );

    setSelectedItemGroups(selectedOption);
  };

  const getProductsFilterAndData = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1;
    const currentSearch = queryParams.get("search");
    const itemsFromURL = queryParams.get("items");
    const subItemsFromURL = queryParams.get("sub-items");
    const sizeFromURL = queryParams.get("sizes");
    const stylesFromURL = queryParams.get("styles");
    const itemGroupFromURL = queryParams.get("item-group");
    const companyIdFromURL = queryParams.get("companyId");
    setPagination((prev) => ({ ...prev, currentPage: currentPage }));

    const companyTagRes = await profileService.GetCompanyTag();
    const companyData = companyTagRes?.data
      ?.map((data) => data?.company_tag_id)
      .join(",");

    try {
      const productsResponse = await fetch(
        "https://api.indianjewelcast.com/api/Tag/GetAll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PageNo: currentPage || 1,
            PageSize: 20,
            DeviceID: 0,
            SortBy: "",
            SearchText: currentSearch || "",
            TranType: "",
            CommaSeperate_ItemGroupID: itemGroupFromURL || "",
            CommaSeperate_ItemID: itemsFromURL || "",
            CommaSeperate_StyleID: stylesFromURL || "",
            CommaSeperate_ProductID: "",
            CommaSeperate_CompanyID: companyIdFromURL
              ? companyIdFromURL
              : companyData,
            CommaSeperate_SubItemID: subItemsFromURL || "",
            CommaSeperate_AppItemCategoryID: "",
            CommaSeperate_ItemSubID: "",
            CommaSeperate_KarigarID: "",
            CommaSeperate_BranchID: "",
            CommaSeperate_Size: sizeFromURL || "",
            CommaSeperate_CounterID: "",
            MinNetWt: 0,
            OnlyCartItem: false,
            OnlyWishlistItem: false,
            StockStatus: "",
            DoNotShowInClientApp: 0,
            HasTagImage: 0,
            MaxNetWt: 1000,
          }),
        }
      );
      const productsData = await productsResponse.json();
      setProducts(productsData?.Tags);
      setTotalItems(productsData?.TotalItems);
      setIsLoading(false);

      const filterResponse = await fetch(
        "https://api.indianjewelcast.com/api/Tag/GetFilters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PageNo: 1,
            PageSize: 20,
            DeviceID: 0,
            SortBy: "",
            SearchText: currentSearch || "",
            TranType: "",
            CommaSeperate_ItemGroupID: itemGroupFromURL || "",
            CommaSeperate_ItemID: itemsFromURL || "",
            CommaSeperate_StyleID: stylesFromURL || "",
            CommaSeperate_ProductID: "",
            CommaSeperate_SubItemID: subItemsFromURL || "",
            CommaSeperate_AppItemCategoryID: "",
            CommaSeperate_ItemSubID: "",
            CommaSeperate_KarigarID: "",
            CommaSeperate_BranchID: "",
            CommaSeperate_Size: sizeFromURL || "",
            CommaSeperate_CounterID: "",
            MinNetWt: 0,
            OnlyCartItem: false,
            OnlyWishlistItem: false,
            StockStatus: "",
            DoNotShowInClientApp: 0,
            HasTagImage: 0,
            CommaSeperate_CompanyID: companyIdFromURL
              ? companyIdFromURL
              : companyData,
            MaxNetWt: 1000,
          }),
        }
      );
      const filterData = await filterResponse.json();
      setFilters(filterData?.Filters);

      if (currentSearch) {
        setTagNoChange(currentSearch);
      } else {
        setTagNoChange(null);
      }

      if (filterData?.Filters && itemsFromURL) {
        const selectedItem = filterData?.Filters?.Items?.find(
          (item) => item?.ItemID === Number(itemsFromURL)
        );
        setSelectedItems({
          value: selectedItem?.ItemID,
          label: selectedItem?.ItemName,
        });
      } else {
        setSelectedItems(null);
      }

      if (filterData?.Filters && subItemsFromURL) {
        const selectedSubItem = filterData?.Filters?.SubItems?.find(
          (item) => item?.SubItemID === Number(subItemsFromURL)
        );

        setSelectedSubItems({
          value: selectedSubItem?.SubItemID,
          label: selectedSubItem?.SubItemName,
        });
      } else {
        setSelectedSubItems(null);
      }

      if (filterData?.Filters && sizeFromURL) {
        const selectedSize = filterData?.Filters?.Size?.find(
          (item) => item?.RowNumber === Number(sizeFromURL)
        );
        setSelectedSizes({
          value: selectedSize?.RowNumber,
          label: selectedSize?.Size1,
        });
      } else {
        setSelectedSizes(null);
      }

      if (filterData?.Filters && stylesFromURL) {
        const selectedStyles = filterData?.Filters?.Styles?.find(
          (item) => item?.StyleID === Number(stylesFromURL)
        );
        setSelectedStyles({
          label: selectedStyles?.StyleName,
          value: selectedStyles?.StyleID,
        });
      } else {
        setSelectedStyles(null);
      }

      if (filterData?.Filters && itemGroupFromURL) {
        const selectedItemGruop = filterData?.Filters?.ItemGroups?.find(
          (item) => item?.ItemGroupID === Number(itemGroupFromURL)
        );
        setSelectedItemGroups({
          label: selectedItemGruop?.GroupName,
          value: selectedItemGruop?.ItemGroupID,
        });
      } else {
        setSelectedItemGroups(null);
      }

      if (filterData?.Filters && companyIdFromURL) {
        const selectedCompanyIds = JewelleryType.find(
          (item) => item?.id === companyIdFromURL
        );
        setCompanyId({
          label: selectedCompanyIds?.name,
          value: selectedCompanyIds?.id,
        });
      } else {
        setCompanyId(null);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(true);
    }
  };

  const fetchMasterGroups = async () => {
    try {
      const res = await profileService.GetMasterGroups();
      setMasterGroups(res?.data?.Items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMasterGroups();
  }, []);

  useLayoutEffect(() => {
    getProductsFilterAndData();
  }, [location.search]);

  const updatePagination = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate(`/ready-to-dispatch?${queryParams.toString()}`);
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

  const fetchPdfList = async () => {
    try {
      const res = await DealerPdf.readyPdfList({ email: email });
      setPdfItems(res?.data?.ready_pdfs_list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchProductPrices = async () => {
      try {
        const res = await profileService.GetProductsPrices();
        setAllPrices(res?.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProductPrices();

    if (email) {
      fetchPdfList();
    }
  }, [email]);

  const addToPDF = async (e, product, allPrices) => {
    e.preventDefault();

    if (!pdfItems?.some((item) => item?.barcode === product?.Barcode)) {
      try {
        const res = await DealerPdf.readytAddToPdf({
          email: email,
          company_id: 4,
          item_group_id: 44,
          item_id: product?.ItemGroupID,
          sub_item_id: product?.ItemSubID,
          style_id: product?.StyleID,
          barcode: product?.Barcode,
          tag_no: product?.TagNo,
          group_name: product?.GroupName,
          name: product?.ItemName,
          size: "",
          gross_weight: product?.GrossWt,
          net_weight: product?.NetAmt,
          metal_value: allPrices?.metal_value,
          making_charge: allPrices?.labour_charge,
          making_charge_discount: allPrices?.labour_charge_discount,
          total_amount: allPrices?.total_prices,
        });

        fetchPdfList();
        toast.success(res?.message);
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  const removeToPDF = async (e, product) => {
    e.preventDefault();
    try {
      const res = await DealerPdf.readyRemovePdf({
        design_ids: [product.Barcode],
      });
      if (res?.success === true) {
        fetchPdfList();
        toast.success(res?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const DealerLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/dealer-login");
  };

  var finalPrice = [
    {
      price_24k: allPrices?.price_24k,
    },
    {
      sales_wastage: allPrices?.sales_wastage_rtd,
    },
    {
      sales_wastage_discount: allPrices?.sales_wastage_discount_rtd,
    },
  ];

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const pdfTip = <Tooltip id="tooltip">My PDF share</Tooltip>;
  const shimmerItems = Array(20).fill(null);

  return (
    <>
      <Helmet>
        <title>Impel Store - Ready Jewellery</title>
      </Helmet>
      <section className="ready-to-dispatch">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Jewellery"
                isClearable
                isSearchable={false}
                value={companyId}
                onChange={handleCompanyId}
                options={JewelleryType?.map((data) => ({
                  label: data?.name,
                  value: data?.id,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <div className="form-group d-flex align-items-center">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search with tag no"
                  value={tagNoChange}
                  onChange={(e) => handleSearchItems(e)}
                  isClearable={true}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Item"
                isClearable
                isSearchable={false}
                value={selectedItems}
                onChange={handleItems}
                options={masterGroups?.map((data) => ({
                  label: data?.ItemName,
                  value: data?.ItemID,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-4 mb-2">
              <Select
                placeholder="Select Sub Item"
                isClearable
                isSearchable={false}
                value={selectedSubItems}
                onChange={handleSubItems}
                options={filters?.SubItems?.map((data) => ({
                  label: data?.SubItemName,
                  value: data?.SubItemID,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Sizes"
                isClearable
                isSearchable={false}
                value={selectedSizes}
                onChange={handleSizes}
                options={filters?.Size?.map((data) => ({
                  label: data?.Size1,
                  value: data?.RowNumber,
                }))}
              />
            </div>

            {/* <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Category"
                isClearable
                isSearchable={false}
                value={selectedItemGroups}
                onChange={handleSelectedItemGroup}
                options={filters?.ItemGroups?.map((data) => ({
                  label: data?.GroupName,
                  value: data?.ItemGroupID,
                }))}
              />
            </div> */}

            <div className="col-lg-3 col-md-6 col-12 mb-md-4 mb-2">
              <Select
                placeholder="Select Style"
                isClearable
                isSearchable={false}
                value={selectedStyles}
                onChange={handleSelectedStyle}
                options={filters?.Styles?.map((data) => ({
                  label: data?.StyleName,
                  value: data?.StyleID,
                }))}
              />
            </div>
          </div>
          {isLoading ? (
            <>
              <div className="row">
                {shimmerItems?.map((_, index) => (
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
              <div className="row mt-md-0 mt-4">
                {products?.length > 0 ? (
                  <>
                    {products?.map((data, index) => {
                      var sales_wastage_of_category =
                        finalPrice[1]?.sales_wastage[data?.SubItemID] || 0;

                      var sales_wastage_discount_of_category =
                        finalPrice[2]?.sales_wastage_discount[
                          data?.SubItemID
                        ] || 0;

                      var labour_charge =
                        (finalPrice[0]?.price_24k[data?.SubItemID] *
                          sales_wastage_of_category) /
                          100 || 0;

                      if (labour_charge > 0) {
                        labour_charge = labour_charge * data?.NetWt || 0;
                      }

                      const labour_charge_discount =
                        sales_wastage_discount_of_category > 0
                          ? labour_charge -
                            (labour_charge *
                              sales_wastage_discount_of_category) /
                              100
                          : 0;

                      var metal_value =
                        finalPrice[0]?.price_24k[data?.SubItemID] *
                          (data?.Touch / 100) *
                          data?.NetWt || 0;

                      var finalPriceWithoutDis = metal_value + labour_charge;
                      var finalPriceWithDis =
                        metal_value + labour_charge_discount;

                      const allPrices = {
                        total_prices:
                          labour_charge_discount > 0
                            ? finalPriceWithDis
                            : finalPriceWithoutDis,
                        labour_charge_discount: numberFormat(
                          labour_charge_discount
                        ),
                        metal_value: numberFormat(metal_value),
                        labour_charge: numberFormat(labour_charge),
                      };

                      return (
                        <>
                          <div className="col-lg-3 col-md-6 col-12" key={index}>
                            <motion.div
                              className="item-product text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Link to={`/ready-to-dispatch/${data?.TagNo}`}>
                                <div
                                  className="product-thumb"
                                  width="100%"
                                  height="100%"
                                >
                                  <motion.img
                                    src={
                                      data?.Images && data.Images[0]?.ImageName
                                        ? `${imageURL}${data.Images[0].ImageName}`
                                        : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                                    }
                                    alt=""
                                    className="w-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                  />
                                </div>
                              </Link>

                              <div className="wishlist-top">
                                {userType === "1" && (
                                  <>
                                    <div className="mt-2">
                                      {email ? (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={pdfTip}
                                        >
                                          <Link
                                            to="#"
                                            className=""
                                            onClick={(e) => {
                                              if (
                                                pdfItems?.find(
                                                  (item) =>
                                                    item?.barcode ===
                                                    data?.Barcode
                                                )
                                              ) {
                                                removeToPDF(e, data);
                                              } else {
                                                addToPDF(e, data, allPrices);
                                              }
                                            }}
                                          >
                                            {pdfItems?.find(
                                              (item) =>
                                                item?.barcode === data?.Barcode
                                            ) ? (
                                              <FaFilePdf />
                                            ) : (
                                              <FaRegFilePdf />
                                            )}
                                          </Link>
                                        </OverlayTrigger>
                                      ) : (
                                        <span onClick={(e) => DealerLogin(e)}>
                                          <FaRegFilePdf />
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="product-info d-grid">
                                {labour_charge_discount > 0 && user_id ? (
                                  <>
                                    <del>
                                      ₹{numberFormat(finalPriceWithoutDis)}
                                    </del>
                                    <label>
                                      <strong className="text-success">
                                        ₹{numberFormat(finalPriceWithDis)}
                                      </strong>
                                    </label>
                                  </>
                                ) : (
                                  <strong className="text-success">
                                    ₹{numberFormat(finalPriceWithoutDis)}
                                  </strong>
                                )}
                              </div>

                              {userType === "1" && (
                                <div className="mt-2">
                                  <span
                                    style={{
                                      color: "#db9662",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {data?.TagNo}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </>
                      );
                    })}

                    {/* PAGINATION */}
                    <div className="pt-5">
                      {totalPages > 1 && (
                        <div className="paginationArea">
                          <nav aria-label="navigation">
                            <ul className="pagination">
                              <li
                                className={`page-item ${
                                  pagination.currentPage === 1 ? "disabled" : ""
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
                                    (pageNumber >= pagination.currentPage - 1 &&
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
                  <>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="not-products">
                          <p>No products available.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ReadytoDispatch;
