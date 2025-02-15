
import React from 'react';
import { Phone, MapPin, Mail, ArrowRight, Store } from 'lucide-react';
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Customer Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Support</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="font-medium text-white">+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>123 Commerce St, NY, USA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>support@localshop.com</span>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Top Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">Computer & Laptop</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Smartphone</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Headphones</a>
              </li>
              <li>
                <a href="#" className="font-medium text-white hover:text-primary transition-colors">Accessories</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Camera & Photo</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">TV & Homes</a>
              </li>
              <li>
                <a href="#" className="inline-flex items-center gap-1 text-primary hover:gap-2 transition-all">
                  Browse All Products
                  <ArrowRight size={16} />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">Shop Product</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Shopping Cart</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Wishlist</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Compare</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Track Order</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Customer Help</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">Register as Seller</a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Download App</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-white hover:text-primary border-gray-700"
              >
                <Store className="mr-2 h-4 w-4" />
                Google Play Store
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-white hover:text-primary border-gray-700"
              >
                <Store className="mr-2 h-4 w-4" />
                Apple App Store
              </Button>
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Game', 'iPhone', 'TV', 'Asus Laptops',
                'MacBook', 'SSD', 'Graphics Card',
                'Power Bank', 'Smart TV', 'Speaker',
                'Tablet', 'Microwave', 'Samsung'
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-800 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
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
