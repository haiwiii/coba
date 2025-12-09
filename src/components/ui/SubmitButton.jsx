function SubmitButton({ label }) {
    return (
        <button type='submit' className='w-full h-12 bg-gradient-to-r from-[#9B22F0] to-[#7C3AED] text-white rounded-lg shadow-md font-semibold hover:opacity-95 transition-opacity'>{ label }</button>
    );
}

export default SubmitButton;
