import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetails from "./screens/CustomerDetails";
import PlaceOrder from "./screens/PlaceOrder";
import OrderScreen from "./screens/OrderScreen";
import OrderHistory from "./screens/OrderHistory";
import ProfileScreen from "./screens/ProfileScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./screens/Dashboard";
import AdminRoute from "./components/AdminRoute";
import ProductList from "./screens/ProductList";
import EditProductAdded from "./screens/EditProductAdded";
import OrdersList from "./screens/OrdersList";
import UserList from "./screens/UserList";
import UserEdit from "./screens/UserEdit";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("customerDetails");
    window.location.href = "/signin";
  };

  return (
    <BrowserRouter>
      <div className='bg-gray-100 min-h-screen'>
        <ToastContainer position='bottom-center' limit={1} />
        <header className='bg-gray-800 text-white'>
          <nav className='container mx-auto flex items-center justify-between py-3'>
            <Link to='/' className='text-xl font-bold'>
              <div className='flex justify-center items-center gap-4'>
                <img
                  src='./LOGO.jpg'
                  alt='logo'
                  className='h-10 w-10 rounded-full'
                />
                Marian Shop
              </div>
            </Link>
            <Link to='/cart' className='nav-link text-xl font-bold'>
              Cart
              {cart.cartItems.length > 0 && (
                <span className='inline-block px-2 dspy-1 text-xs font-bold leading-none text-white bg-red-600 rounded'>
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                <LinkContainer to='/userprofile'>
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/orderhistory'>
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className='dropdown-item'
                  to='#signout'
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className='nav-link' to='/signin'>
                Sign In
              </Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title='Admin' id='admin-nav-drapdown'>
                <LinkContainer to='/admin/dashboard'>
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/products'>
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/orders'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/users'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            {userInfo && userInfo.isSeller && (
              <NavDropdown title='Seller' id='seller-nav-drapdown'>
                <LinkContainer to='/seller/dashboard'>
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/seller/products'>
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/seller/orders'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </nav>
        </header>
        <main className='container mx-auto  py-6'>
          <Routes>
            <Route path='/product/:slug' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/signin' element={<SigninScreen />} />
            <Route path='/signup' element={<SignupScreen />} />
            <Route path='/confirm' element={<CustomerDetails />} />
            <Route
              path='/placeorder'
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path='/order/:id'
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orderhistory'
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path='/userprofile'
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route path='/' element={<HomeScreen />} />
            {/*admin*/}
            <Route
              path='/admin/dashboard'
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/orders'
              element={
                <AdminRoute>
                  <OrdersList />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/users'
              element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/products'
              element={
                <AdminRoute>
                  <ProductList />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/products/:id'
              element={
                <AdminRoute>
                  <EditProductAdded />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/user/:id'
              element={
                <AdminRoute>
                  <UserEdit />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <footer className='bg-gray-800 text-white py-3 text-center'>
          <p className='text-sm'>
            &copy; 2023 Marian Shop. All rights reserved.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
