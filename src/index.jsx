import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CustomersProvider } from './contexts/CustomersContext';
import { DashboardProvider } from './contexts/DashboardContext';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <CustomersProvider>
            <DashboardProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </DashboardProvider>
        </CustomersProvider>
    </AuthProvider>
);