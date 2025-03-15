import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Apple } from 'lucide-react';
import { Button } from "../ui/button";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About LocalShop</h3>
            <p className="text-gray-400">
              Your trusted B2B marketplace connecting businesses worldwide. Find quality products and reliable suppliers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-primary transition-colors">Home</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-primary hover:text-primary/80 transition-colors" 
                  onClick={() => navigate('/seller/login')}
                >
                  Login as Seller
                </a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Download App</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-800 hover:text-white border-gray-700 hover:bg-gray-800"
              >
                <Store className="mr-2 h-5 w-5" />
                Google Play Store
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-gray-800 hover:text-white border-gray-700 hover:bg-gray-800"
              >
                <Apple className="mr-2 h-5 w-5" />
                Apple App Store
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-400">
              Have questions? Get in touch with our support team.
            </p>
            <a href="mailto:support@localshop.com" className="text-primary hover:text-primary/80 transition-colors">
              support@localshop.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            LocalShop - eCommerce Template © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
