import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import AgencyLogin from "./pages/Agency/AgencyLogin";
import AgencyRegister from "./pages/Agency/AgencyRegister";
import CustomerRegister from "./pages/Customer/CustomerRegister";
import CustomerLogin from "./pages/Customer/CustomerLogin";
import AddCar from "./pages/Cars/AddCar";
import AgencyCars from "./pages/Cars/AgencyCars";
import UpdateCarForm from "./pages/Cars/UpdateCarForm";
import CarDetails from "./pages/Cars/CarDetails";
import Profile from "./pages/My Account/Profile";
import UpdateProfile from "./pages/My Account/UpdateProfile";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./pages/My Account/ForgotPassword";

import Home from "./pages/Home/Home";
import CarList from "./pages/Cars/CarList";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import MyAccount from "./pages/My Account/MyAccount";

import { ToastContainer } from "react-toastify";
import AllCarsOrderList from "./pages/Orders/AllCarsOrderList";
import AllCarsRentList from "./pages/Rents/AllCarsRentList";
import CarOrderList from "./pages/Orders/CarOrderList";
import CarRentList from "./pages/Rents/CarRentList";
import OrderListForCustomer from "./pages/Orders/OrderListForCustomer";
import RentListForCustomer from "./pages/Rents/RentListForCustomer";

import AdminRegister from "./pages/Admin/AdminRegister";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminUsers from "./pages/Admin/AdminUsers";
import UpdateUser from "./pages/Admin/UpdateUser";
import AdminAgencyStats from "./pages/Admin/AdminAgencyStats";
import AdminFeedback from "./pages/ContactUs/AdminFeedback";
import AdminCustomerStats from "./pages/Admin/AdminCustomerStats";
import AgencyVerificationList from "./pages/Admin/AgencyVerificationList";
import CustomerVerificationList from "./pages/Admin/CustomerVerificationList";
import AgencyPage from "./pages/Agency/AgencyPage";
import AgencyVerificationForm from "./pages/Agency/AgencyVerificationForm";
import AdminDashboard from "./pages/Admin/AdminDashboard"; 
import TermsAndConditions from "./components/Footer/TermsAndConditions";
import AboutUs from "./components/Footer/About-us";
import CustomerVerificationForm from "./pages/Customer/CustomerVerficationForm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} /> {/* Updated to handle all admin routes */}

            <Route path="/page/agency/:id" element={<AgencyPage />} />

            

            {/* Agency Routes */}
            <Route path="/agency/login" element={<AgencyLogin />} />
            <Route path="/agency/register" element={<AgencyRegister />} />
            <Route path="/agency/add-car" element={<AddCar />} />
            <Route path="/agency/cars" element={<AgencyCars />} />
            <Route path="/agency/cars/:id/edit" element={<UpdateCarForm />} />
            <Route path="/agency/profile" element={<Profile />} />
            <Route path="/agency/profile-update" element={<UpdateProfile />} />
            <Route path="/agency/cars/orders" element={<AllCarsOrderList />} />
            <Route path="/agency/cars/rents" element={<AllCarsRentList />} />
            <Route path="/agency/cars/:id/orders" element={<CarOrderList />} />
            <Route path="/agency/cars/:id/rents" element={<CarRentList />} />
            <Route
              path="/agency/verification-form"
              element={<AgencyVerificationForm />}
            />

            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route
              path="/customer/profile-update"
              element={<UpdateProfile />}
            />
            <Route
              path="/customer/cars/orders"
              element={<OrderListForCustomer />}
            />
            <Route
              path="/customer/cars/rents"
              element={<RentListForCustomer />}
            />
            <Route path="/customer/verification-form" element={<CustomerVerificationForm/>}/>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Footer routes */}
            <Route
              path="/terms-&-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </div>
        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={10000} // Auto close in 10 seconds
          hideProgressBar={false}
          newestOnTop={true} // Show newest toasts on top
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: "100px" }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
