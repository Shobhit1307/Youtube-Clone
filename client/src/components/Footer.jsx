import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">YouTubeClone</h3>
          <p className="footer-description">
            A modern video sharing platform built with React and Node.js
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Connect With Me</h4>
          <div className="social-links">
            <a 
              href="https://www.instagram.com/shobhitjindal07/profilecard/?igsh=MXVwaGE4b2Ftcng2dw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/shobhit-jindal-0b96b5232" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
              <span>LinkedIn</span>
            </a>
            
            <a 
              href="https://github.com/Shobhit1307" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Features</h4>
          <ul className="footer-features">
            <li>Video Upload & Streaming</li>
            <li>User Authentication</li>
            <li>Channel Management</li>
            <li>Comments & Reactions</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} YouTubeClone. All rights reserved.</p>
        <p>Built with ❤️ using React & Node.js</p>
      </div>
    </footer>
  );
} 