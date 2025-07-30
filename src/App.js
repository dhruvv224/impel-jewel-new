import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/shop/Shop";
import ShopDetails from "./pages/shop/ShopDetails";
import Categories from "./pages/categories/Categories";
import CategoriesItems from "./pages/categories/CategoriesItems";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import DealerLogin from "./pages/auth/DealerLogin";
import Profile from "./pages/user/Profile";
import OrderDetails from "./pages/user/OrderDetails";
import ScrollToTop from "./components/ScrollToTop";
import DealerProtectedRoute from "./utils/DealerProtectedRoute";
import WishList from "./pages/user/WishList";
import DealerWishList from "./pages/Dealer/WishList";
import DealerProfile from "./pages/Dealer/Profile";
import Cart from "./pages/user/Cart";
import { Toaster } from "react-hot-toast";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Errorpage from "./components/Errorpage";
import MyOrders from "./pages/user/MyOrders";
import { HelmetProvider } from "react-helmet-async";
import Resetpassword from "./pages/auth/Resetpassword";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishListContext";
import ProfileProvider from "./context/ProfileContext";
import { useEffect } from "react";
import CustomPage from "./components/CustomPage";
import Topseller from "./pages/shop/Topseller";
import LatestDesign from "./pages/shop/LatestDesign";
import ReadytoDispatch from "./pages/shop/ReadytoDispatch";
import ReadyDetails from "./pages/shop/ReadyDetails";
import ReadyDesignCart from "./pages/user/ReadyDesignCart";
import ReadyDesignCartProvider from "./context/ReadyDesignCartContext";
import MyReadyOrders from "./pages/user/MyReadyOrders";
import ReadyOrderDetails from "./pages/user/ReadyOrderDetails";
import CreatePDF from "./pages/Dealer/CreatePDF";
import OrderTracking from "./pages/user/OrderTracking";
import LandingPage from "./pages/landing-page/LandingPage";
import ThankYou from "./pages/landing-page/ThankYou";
import Popup from "./components/common/Popup";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type");
  const helmetContext = {};

  const shouldShowPopup =
    !["/login", "/dealer-login", "/forget-password", "/jewelery-for-women"].some((path) =>
      location.pathname.startsWith(path)
    ) && !location.pathname.startsWith("/reset-password/");

  useEffect(() => {
    if (userType === Number(1) && location.pathname === "/login") {
      navigate("/");
    } else if (userType === Number(2) && location.pathname === "/login") {
      navigate("/");
    }

    if (userType === Number(2) && location.pathname === "/dealer-login") {
      navigate("/");
    } else if (
      userType === Number(1) &&
      location.pathname === "/dealer-login"
    ) {
      navigate("/");
    }
  }, [userType, location.pathname, navigate]);

  function renderLayout() {
    if (
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/forget-password") ||
      location.pathname.startsWith("/reset-password") ||
      location.pathname.startsWith("/dealer-login") ||
      location.pathname.startsWith("/order-tracking-details") ||
      location.pathname.startsWith("/jewelery-for-women")
    ) {
      return null;
    } else {
      return <Layout />;
    }
  }

  return (
    <>
      <WishlistProvider>
        <ProfileProvider>
          <CartProvider>
            <ReadyDesignCartProvider>
              <ScrollToTop />
              <HelmetProvider context={helmetContext}>
                {/* {shouldShowPopup && userType === null ? <Popup /> : <></>} */}
                <Routes>
                  <>
                    <Route path="/" element={renderLayout()}>
                      {/* COMMON COMPONENT */}
                      <Route
                        path="jewelery-for-women"
                        element={<LandingPage />}
                      />
                      <Route index element={<Home />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="shop/:tag" element={<Shop />} />

                      <Route
                        path="ready-to-dispatch"
                        element={<ReadytoDispatch />}
                      />
                      <Route
                        path="ready-to-dispatch/:id"
                        element={<ReadyDetails />}
                      />

                      <Route path=":id" element={<CustomPage />} />

                      <Route path="shopdetails/:id" element={<ShopDetails />} />
                      <Route path="categories" element={<Categories />} />
                      <Route
                        path="categories/:id"
                        element={<CategoriesItems />}
                      />
                      <Route
                        path="top-selling-designs"
                        element={<Topseller />}
                      />
                      <Route path="latest-designs" element={<LatestDesign />} />

                      {/* USER PROTECTED */}
                      <Route
                        path="wishlist"
                        element={
                          <ProtectedRoute>
                            <WishList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="ready-design-cart"
                        element={
                          <ProtectedRoute>
                            <ReadyDesignCart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="my-orders" element={<MyOrders />} />
                      <Route
                        path="my-ready-orders"
                        element={<MyReadyOrders />}
                      />

                      <Route path="/processing-order" element={<Cart />} />
                      <Route
                        path="/ready-processing-order"
                        element={<ReadyDesignCart />}
                      />
                      <Route
                        path="order-details/:id"
                        element={<OrderDetails />}
                      />
                      <Route
                        path="ready-order-details"
                        element={<ReadyOrderDetails />}
                      />

                      {/* DEALER PROTECTED */}
                      <Route
                        path="dealer-wishlist"
                        element={
                          <DealerProtectedRoute>
                            <DealerWishList />
                          </DealerProtectedRoute>
                        }
                      />
                      <Route
                        path="dealer-profile"
                        element={
                          <DealerProtectedRoute>
                            <DealerProfile />
                          </DealerProtectedRoute>
                        }
                      />
                      <Route
                        path="create-pdf"
                        element={
                          <DealerProtectedRoute>
                            <CreatePDF />
                          </DealerProtectedRoute>
                        }
                      />

                      {/* AUTH */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/dealer-login" element={<DealerLogin />} />
                      <Route
                        path="/forget-password"
                        element={<ForgetPassword />}
                      />
                      <Route
                        path="/reset-password/:token"
                        element={<Resetpassword />}
                      />
                      <Route
                        path="/order-tracking-details"
                        element={<OrderTracking />}
                      />
                    </Route>
                  </>

                  <Route path="*" element={<Errorpage />} />
                  <Route
                    path="/jewelery-for-women/thank-you"
                    element={<ThankYou />}
                  />
                </Routes>
              </HelmetProvider>
            </ReadyDesignCartProvider>
          </CartProvider>
        </ProfileProvider>
      </WishlistProvider>
      <Toaster toastOptions={{ duration: 2000 }} />
    </>
  );
}
export default App;
