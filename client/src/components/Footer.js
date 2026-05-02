import React from 'react';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';

const columns = [
  {
    title: 'Our Services',
    links: ['Luxury Room Booking', 'Spa & Wellness Packages', 'Guided City Tours', 'Event & Conference Spaces', 'Exclusive Member Benefits'],
  },
  {
    title: 'About Us',
    links: ['Our Journey', 'Join Our Team', 'News & Blog', 'Media & Press', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Travel Tips', 'How to Book', 'Partner Programs', 'Faq\'s'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
  },
];

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>TravelMate</h2>
            <p>Unforgettable Experiences Start With Us</p>
            <div className="social-icons">
              <a href="#" className="social-icon"><Facebook size={16} /></a>
              <a href="#" className="social-icon"><Twitter size={16} /></a>
              <a href="#" className="social-icon"><Instagram size={16} /></a>
              <a href="#" className="social-icon"><Send size={16} /></a>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="footer-column">
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>Copyright 2026 - All Right Reserved</span>
          <span>Tap to top</span>
        </div>
      </div>
    </footer>
  );
}
