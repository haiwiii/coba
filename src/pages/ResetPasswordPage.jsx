import AuthPageComponent from "../components/auth/AuthPageComponent";
import useInput from "../hooks/useInput";
import { useState } from 'react';
import AuthForm from "../components/auth/AuthForm";
import SubmitButton from "../components/ui/SubmitButton";
import Input from '../components/auth/Input'
import { Link } from "react-router-dom";
import { resetPassword } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || {};
    const [password, rawOnPasswordChange] = useInput('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    function onPasswordChange(e) {
        setErrorMsg('');
        setSuccessMsg('');
        rawOnPasswordChange(e);
    }

    async function onSubmitHandler(e) {
        e.preventDefault();
        
        const resetStat = await resetPassword({ username, password });
        if (!resetStat.error) {
            console.log("Password Reset Successful");
            setSuccessMsg('Password reset complete — redirecting to login...');
            // short delay to show success message and redirect
            setTimeout(() => navigate('/'), 900);
            return;
        }

        // show inline error when reset failed
        setErrorMsg(resetStat?.message || 'Unable to reset password');
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Reset Password'>

                <Input
                label={"Password"}
                type={"password"}
                value={password}
                maxLength={100}
                onChange={onPasswordChange}
                />

                {errorMsg && (
                    <div className="w-full text-left mt-2">
                        <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md shadow-sm">{errorMsg}</div>
                    </div>
                )}

                {successMsg && (
                    <div className="w-full text-left mt-2">
                        <div className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-md shadow-sm">{successMsg}</div>
                    </div>
                )}

                <SubmitButton
                label='Reset'
                />

                <div className="w-full text-center mt-3 text-sm">
                    <small>Already have an account? <Link to='/' className="text-blue-600 font-semibold">Login here</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default ResetPasswordPage;