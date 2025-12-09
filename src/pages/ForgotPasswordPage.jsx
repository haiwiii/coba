import AuthPageComponent from "../components/auth/AuthPageComponent";
import useInput from "../hooks/useInput";
import { useState } from 'react';
import AuthForm from "../components/auth/AuthForm";
import SubmitButton from "../components/ui/SubmitButton";
import Input from '../components/auth/Input'
import { Link } from "react-router-dom";
import { verifyUsername } from "../api/api";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, rawOnEmailChange] = useInput('');
    const [errorMsg, setErrorMsg] = useState('');

    // wrap the original onChange to clear existing errors when the user types
    function onEmailChange(e) {
        setErrorMsg('');
        rawOnEmailChange(e);
    }

    async function onSubmitHandler(e) {
        e.preventDefault();

        const usernameStat = await verifyUsername({ username: email });
        if (!usernameStat || usernameStat.error) {
            // show friendly inline error (fallback message if API didn't include one)
            setErrorMsg(usernameStat?.message || 'Username / email not found');
            return;
        }

        if (usernameStat.data?.result) {
            console.log("Username/Email Exists");
            
            navigate('/reset-password', { 
                state: { username: email }
              });
        }
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Forgot Password' Heading={true}>
                {errorMsg && (
                    <div className="w-full text-left mb-3">
                        <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-red-600 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01" /></svg>
                            <div className="flex-1">
                                <div className="font-semibold">{errorMsg}</div>
                                <div className="text-xs text-red-600/90 mt-1">Please make sure the email address you entered is correct.</div>
                            </div>
                            <button onClick={() => setErrorMsg('')} aria-label="Dismiss" className="text-red-600/80 hover:text-red-700 p-1 rounded-full">✕</button>
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-gray-700/90 mb-2">Please enter your registered email address to recover your account.</p>

                <Input
                label={"Email"}
                type={"email"}
                value={email}
                maxLength={100}
                onChange={onEmailChange}
                />

                {/* moved popup to appear under the form heading instead of inline here */}

                <SubmitButton
                label='Send'
                />

                <div className="w-full text-center mt-3 text-lg">
                    <small>Already have an account? <Link to='/' className="text-blue-600 font-semibold">Login here</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default ForgotPasswordPage;