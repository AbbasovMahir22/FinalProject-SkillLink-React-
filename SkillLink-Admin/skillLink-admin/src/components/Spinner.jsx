import React from 'react';

const Spinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
    );
};

export default Spinner;