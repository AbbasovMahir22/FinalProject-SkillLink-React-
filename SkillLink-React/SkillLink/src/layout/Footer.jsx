import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/Images/SkillLink.png';

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaGithub,
    FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="bg-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-black">

                <div>
                    <h3 className="text-lg font-semibold mb-2">Cite</h3>
                    <ul className="space-y-1 text-sm text-black font-bold">
                        <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-600">Terms</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-600">Privacy</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Follow us</h3>
                    <div className="flex space-x-4 text-xl text-black">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600"><FaFacebookF /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400"><FaTwitter /></a>
                        <a href="https://github.com/AbbasovMahir22?tab=repositories" target="_blank" rel="noreferrer" className="hover:text-black"><FaGithub /></a>
                    </div>
                </div>

                <div className="flex flex-col justify-start items-start gap-3 md:items-end">
                    <div className="text-sm  flex justify-between  items-center  ">

                        <div className="w-[150px] h-[60px] flex  ">
                            <Link to="/" className="flex justify-center items-center gap-3">
                                <p className="flex items-center justify-between">&copy;2025</p>
                                <span className="text-2xl text-blue-700">SkillLink</span>
                            </Link>
                            
                        </div>
                        <p className="min-w-44 font-bold">All rights reserved</p>
                    </div>
                    <button
                        onClick={scrollToTop}
                        className="mt-4  rounded-full p-2.5 flex items-center gap-2 text-2xl text-white cursor-pointer hover:bg-blue-600 bg-blue-800"
                    >
                        <FaArrowUp className="w-[30px] h-[30px]" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;