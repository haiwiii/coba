import logo from '../../assets/picture/LeadSightLogo.png';

function AuthForm({ onSubmit, subheading, children, bigHeading = false }) {
    return(
        <form
            onSubmit={ onSubmit }
            className="w-full max-w-[425px] bg-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center justify-center gap-6"
        >
            <div className="flex items-center gap-3 mb-2">
                <img id="logo" src={logo} alt="leadsight-logo" className="w-10 h-10 object-contain" />
                <h3 className="font-extrabold text-[20px] bg-gradient-to-r from-[#9B22F0] to-[#7C3AED] bg-clip-text text-transparent">LeadSight</h3>
            </div>

            <h2
                className={`${
                    bigHeading
                        ? 'text-3xl sm:text-4xl md:text-5xl font-extrabold -mt-4 sm:-mt-6'
                        : 'text-2xl sm:text-3xl font-bold'
                } bg-gradient-to-r from-[#9B22F0] to-[#59148A] bg-clip-text text-transparent text-center`}
            >
                {subheading}
            </h2>

            {children}
        </form>
    );
}

export default AuthForm;
