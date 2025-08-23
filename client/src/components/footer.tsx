import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Palm Aire Court</h3>
            <p className="text-gray-300 mb-4">
              Your desert home away from home in Phoenix, Arizona.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-facebook-link"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-instagram-link"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link 
                  href="/stays" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-stays-link"
                >
                  Stays
                </Link>
              </li>
              <li>
                <Link 
                  href="/rates" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-rates-link"
                >
                  Rates
                </Link>
              </li>
              <li>
                <Link 
                  href="/amenities" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-amenities-link"
                >
                  Amenities
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-about-link"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-contact-link"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-terms-link"
                >
                  Terms
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-privacy-link"
                >
                  Privacy
                </a>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-faq-link"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p data-testid="footer-address">
                9616 N 12th St<br />
                Phoenix, AZ 85020
              </p>
              <p data-testid="footer-phone">480-993-8431</p>
              <p data-testid="footer-email">palmairecourt@outlook.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Palm Aire Court. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
