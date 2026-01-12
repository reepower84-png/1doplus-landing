'use client';

import { useState } from 'react';
import Image from 'next/image';
import CTAButton from './CTAButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer"
            >
              <Image
                src="/로고_최종-removebg-preview.png"
                alt="1도플러스"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              제품 특징
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              건강 효과
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              제품 소개
            </button>
            <CTAButton size="sm" text="상담 신청" />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-red-600 transition-colors text-left cursor-pointer"
              >
                제품 특징
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-gray-700 hover:text-red-600 transition-colors text-left cursor-pointer"
              >
                건강 효과
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="text-gray-700 hover:text-red-600 transition-colors text-left cursor-pointer"
              >
                제품 소개
              </button>
              <CTAButton size="sm" text="상담 신청" className="w-full" />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
