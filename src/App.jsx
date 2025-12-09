import { Navigate, Route, Routes } from "react-router-dom";
import AddedCustomerReminder from './components/common/AddedCustomerReminder';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import Promotion from "./pages/Promotion";
import CustomerEntry from "./pages/CustomerEntry";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <>
      <AddedCustomerReminder />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/customer-entry" element={<CustomerEntry />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
