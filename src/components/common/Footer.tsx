import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Quick<span className="text-orange-500">Bite</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Order delicious food from the best local restaurants near you. Fast, hot, and straight to your doorstep.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-orange-500 transition-colors">All Restaurants</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-orange-500 transition-colors">Search Foods</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-orange-500 transition-colors">My Profile</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-500 transition-colors">Merchant Portal</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span>123 Main Street, Downtown City, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <span>support@quickbite.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe to get the latest promo codes, discounts, and food blogs.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <Button variant="primary" size="icon" className="shrink-0 h-10 w-10 rounded-xl">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 QuickBite App. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
