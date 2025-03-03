import { Apple, AppleIcon, Facebook, Github, Instagram } from "lucide-react";

export default function Footer() {


    return (

        <div className="flex flex-col pl-10 pr-10 pt-10 pb-10 border-t-2 outline-0.2 border-gray-200">

            <div className="flex justify-between">

                <div className="ml-30">
                    <p className="mb-4 text-gray-500 text-xl">For Client</p>

                    <p className="text-gray-600 mb-2 text-lg font-semibold">Talent Marketplace</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Project Catalog</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Hire an agency</p>
                </div>

                <div>
                    <p className="mb-4 text-gray-500 text-xl">For Talent</p>

                    <p className="text-gray-600 mb-2 text-lg font-semibold">How to find work</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Direct Contracts</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Win work with ads</p>
                </div>

                <div>
                    <p className="mb-4 text-gray-500 text-xl">Resources</p>

                    <p className="text-gray-600 mb-2 text-lg font-semibold">Help & support</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Success </p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Blog</p>
                </div>

                <div className="mr-30">
                    <p className="mb-4 text-gray-500 text-xl">Company</p>

                    <p className="text-gray-600 mb-2 text-lg font-semibold">About us</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Leardership</p>
                    <p className="text-gray-600 mb-2 text-lg font-semibold">Carees</p>
                </div>

            </div>

            <div className="flex justify-between mt-15 items-center">

                <div className="ml-30 flex justify-center items-center gap-8">
                    <p className="text-gray-500 text-xl">Follow us</p>
                    <Facebook className="text-gray-600 font-semibold hover:text-blue-600 transition w-8 h-8" />
                    <Github className="text-gray-600 font-semibold hover:text-blue-600 transition w-8 h-8" />
                    <Instagram className="text-gray-600 font-semibold hover:text-blue-600 transition w-8 h-8" />
                </div>

                <div className="mr-30 flex justify-center items-center gap-8">
                    <p className="text-gray-500 text-xl">Platform</p>
                    <Apple className="text-gray-600 font-semibold hover:text-blue-600 transition w-8 h-8" />
                </div>

            </div>

            <div className="mx-30 mt-5">
                <hr />
            </div>

            <div className="flex justify-between mt-10 mx-30 items-center">
                <p className="text-gray-500 text-lg">© 2015 - 2025 Ergasia Global Inc.</p>
                <div className="flex gap-5">
                    <p>Terms of Service</p>
                    <p>Privacy Policy</p>
                    <p>CA Notice at Collection</p>
                    <p>Cookie Settings</p>
                    <p>Accessibillity</p>
                </div>
            </div>
        </div>
    );
}