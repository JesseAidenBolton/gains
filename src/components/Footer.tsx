// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-200 text-center text-sm py-4">
            ©2023 Made with ❤️ by
            <a href="https://github.com/JesseAidenBolton"
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline ml-1">
                Jesse Bolton
            </a>
        </footer>
    );
};

export default Footer;
