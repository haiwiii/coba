import statsIcon from '../../assets/picture/10 1.png';

function AuthPageComponent({ children }) {
    return(
        <div className="w-full min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center p-6" style={{ background: 'linear-gradient(to top, #A581DF, #A38CF4, #D6D0FF, #EEF0F6)' }}>
            {/* left marketing column */}
            <div className="flex-1 flex flex-col items-start max-w-[680px] px-4 lg:px-12 py-6 lg:order-1">
                <img src={statsIcon} alt="stats-illustration" className="max-w-[340px] sm:max-w-[440px] self-center mb-8" />
                <h2 className="text-3xl lg:text-3xl font-bold text-white mb-4">See the Leads, Shape the Sales</h2>
                    <p className="mt-2 text-white text-lg mb-6 opacity-95">Your sales superpower is here!</p>
                <p className="text-white max-w-xl opacity-90">With AI-driven predictions and smart dashboards, you can plan better, move faster, and hit your targets with confidence.</p>
            </div>

            {/* vertical divider */}
            <div className="hidden lg:block w-px h-[420px] bg-white/10 mx-2 shadow-sm" aria-hidden />

            {/* right form column */}
            <div className="flex-1 flex items-center justify-center px-4 lg:px-12 py-6 lg:order-2">
                { children }
            </div>
        </div>
    );
}

export default AuthPageComponent;
