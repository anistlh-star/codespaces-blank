//ecommerce/frontend/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";

// ── Public / Main site ────────────────────────────────────────
import Navbar from "./components/Navbar";
// import HomePage from "./pages/MainPages/HomePage/HomePage1.jsx";
import Login from "./pages/AuthPages/Login.jsx";
import Register from "./pages/AuthPages/Register.jsx";
import ProductListPage from "./pages/MainPages/ProductListPage/ProductListPage.jsx";
// ── Admin ─────────────────────────────────────────────────────
import AdminLayout from "./pages/AdminPages/AdminLayout.jsx";
import DashboardPage from "./pages/AdminPages/DashboardPage.jsx";

// Products (admin)
import ProductList from "./pages/AdminPages/ProductComponents/ProductList.jsx";
import SingleProductPage from "./pages/AdminPages/ProductComponents/SingleProductPage.jsx";
import AddProduct from "./pages/AdminPages/ProductComponents/AddProduct.jsx";
import EditProductPage from "./pages/AdminPages/ProductComponents/EditProductPage.jsx";

// Categories (admin)
import CategoryPage from "./pages/AdminPages/CategoryComponents/CategoryPage.jsx";
import SingleCategoryPage from "./pages/AdminPages/CategoryComponents/SingleCategoryPage.jsx";
import EditCategoryPage from "./pages/AdminPages/CategoryComponents/EditCategoryPage.jsx";

// Orders (admin)
import OrdersPage from "./pages/AdminPages/OrdersComponent/OrdersPage.jsx";
import OrderDetailsPage from "./pages/AdminPages/OrdersComponent/OrderDetailsPage.jsx";

// Users (admin)
import UserPage from "./pages/AdminPages/UserComponents/UserPage.jsx";
import ProductDetailPage from "./pages/MainPages/ProductListPage/ProductDetailPage.jsx";
import CartPage from "./pages/MainPages/CartPage/CartPage.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/MainPages/HomePage/Homepage.jsx";
import CheckoutPage from "./pages/MainPages/CartPage/Checkout.jsx";
import NewArrivalsPage from "./pages/MainPages/OtherPages/NewArrivals.jsx";
import OrderSuccess from "./pages/MainPages/CartPage/OrderSuccess.jsx";
import MyOrders from "./pages/AdminPages/OtherPages/MyOrders.jsx";
import OrderDetails from "./pages/AdminPages/OtherPages/OrderDetails.jsx";
import MyProductDetail from "./pages/UserPages/MyProductDetail.jsx";
import UserManagement from "./pages/AdminPages/UserComponents/UserManagement.jsx";
import AdminUserProfile from "./pages/AdminPages/AdminUserProfile.jsx";
import UserProfile from "./pages/UserPages/UserProfile.jsx";
import MyProducts from "./pages/UserPages/MyProducts.jsx";
import AddEditProduct from "./pages/UserPages/AddEditProduct.jsx";
import Wishlist from "./pages/UserPages/Wishlist.jsx";
import CategoryProducts from "./pages/MainPages/OtherPages/CategoryProducts.jsx";
import TermsConditions from "./pages/Misc/Terms&Conditions.jsx";
import ShippingDelivery from "./pages/Misc/Shipping&Delivery.jsx";
import ReturnsRefunds from "./pages/Misc/Returns&Refunds.jsx";
import PrivacyPolicy from "./pages/Misc/PrivacyPolicy.jsx";
import Contact from "./pages/Misc/Contact.jsx";
import AboutUs from "./pages/Misc/AboutUs.jsx";
import ResetPassword from "./pages/Misc/ResetPassword.jsx";
import ForgotPassword from "./pages/Misc/ForgotPassword.jsx";
import AIToolsPage from "./pages/AI Tools/AIToolsPage.jsx";
import SupportChat from "./components/SupportChat.jsx";
import ChatBasic from "./pages/Practicepage/ChatBasic.jsx";

// ── Protected Route component ─────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required → check them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const CartWrapper = ({ children }) => {
  const { user } = useAuth();

  return <CartProvider userId={user?._id}>{children}</CartProvider>;
};

// ── Public layout with Navbar ─────────────────────────────────
const PublicLayout = () => (
  <>
    <Navbar />

    <main>
      <Outlet /> {/* ← this will render child routes */}
    </main>
    <Footer />
              <SupportChat />

  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartWrapper>
          <Routes>
            {/* ── Public routes ────────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="shop" element={<ProductListPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="newarrivals" element={<NewArrivalsPage />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="my-orders/:id" element={<OrderDetails />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/my-products/:id" element={<MyProductDetail />} />
              <Route path="/edit-product/:id" element={<AddEditProduct />} />
              <Route path="/add-product" element={<AddEditProduct />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route
                path="/category/:categoryId"
                element={<CategoryProducts />}
              />
              <Route path="terms" element={<TermsConditions />} />
              <Route path="shipping" element={<ShippingDelivery />} />
              <Route path="returns" element={<ReturnsRefunds />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="contact" element={<Contact />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/ai" element={<AIToolsPage />} />
              <Route
                path="/reset/:token"
                element={<ResetPassword />}
              />
              <Route path="/practice" element={<ChatBasic />} />
            </Route>

            {/* ── Admin routes (protected) ─────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "Admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="userprofile" element={<UserProfile />} />

              {/* Products */}
              <Route path="products">
                <Route index element={<ProductList />} />
                <Route path=":id" element={<SingleProductPage />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:id" element={<EditProductPage />} />
              </Route>

              {/* Categories */}
              <Route path="category">
                <Route index element={<CategoryPage />} />
                <Route path=":id" element={<SingleCategoryPage />} />
                <Route path="update/:id" element={<EditCategoryPage />} />
              </Route>

              {/* Orders */}
              <Route path="orders">
                <Route index element={<OrdersPage />} />
                <Route path="details/:id" element={<OrderDetailsPage />} />
              </Route>

              {/* Users */}
              <Route path="users">
                <Route index path="all" element={<UserPage />} />
                <Route path="usermanagement" element={<UserManagement />} />
                <Route path=":id" element={<AdminUserProfile />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
