import AuthPageComponent from "../components/auth/AuthPageComponent";
import useInput from "../hooks/useInput";
import AuthForm from "../components/auth/AuthForm";
import SubmitButton from "../components/ui/SubmitButton";
import Input from '../components/auth/Input';
import { Link } from "react-router-dom";
import { login } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [username, rawUsernameChange] = useInput('');
    const [password, rawPasswordChange] = useInput('');
    // wrap input change handlers so any existing error clears when user modifies inputs
    const [error, setError] = useState(null);

    const onUsernameChange = (e) => {
        setError(null);
        rawUsernameChange(e);
    };

    const onPasswordChange = (e) => {
        setError(null);
        rawPasswordChange(e);
    };

    async function onSubmitHandler(e) {
        e.preventDefault();        

        const loginStat = await login({ username, password });
        if (!loginStat.error) {
            console.log("Login Successful");

            setError(null);
            await loginUser(loginStat.data.accessToken);            
            
            // navigate to main dashboard after successful login
            navigate('/dashboard');
        } else {
            // Show friendly reminder when credentials are wrong / not found
            const msg = loginStat.message || 'Email or password not found';
            // map backend generic messages to clearer reminder
            if (/wrong|invalid|not found/i.test(msg)) {
                setError('Please check your email or password, or use "Forgot Password to reset your account.');
            } else {
                setError(msg);
            }
        }
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Get Started Now' Heading={true}>

                {error && (
                    <div className="w-full text-left mt-3">
                        <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-red-600 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01" />
                            </svg>
                            <div className="flex-1">
                                <div className="font-semibold">{error}</div>
                                <div className="text-xs text-red-600/90 mt-1">Please check your email / password, or use <Link to="/forgot-password" className="underline font-medium text-red-600">Forgot password</Link> to reset your account.</div>
                            </div>
                            <button onClick={() => setError(null)} aria-label="Dismiss" className="text-red-600/80 hover:text-red-700 p-1 rounded-full">✕</button>
                        </div>
                    </div>
                )}

                <Input
                  label={"Username"}
                  type={"email"}
                  value={username}
                  maxLength={100}
                  onChange={onUsernameChange}
                />

                <Input
                  label={"Password"}
                  type={"password"}
                  value={password}
                  maxLength={100}
                  onChange={onPasswordChange}
                />

                <SubmitButton
                label='Login'
                />

                <div className="w-full text-center mt-3 text-lg">
                    <small className="block mb-2">Click to <Link to='/forgot-password' className="text-blue-600 font-semibold">Forgot password</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default LoginPage;