"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
  {
    title: "Test Your DeFi Knowledge",
    description: "Play interactive quizzes and games to benchmark your DeFi skills before deploying real capital.",
    buttonText: "Go to Game Center",
    color: "bg-emerald-500",
    href: "/game",
    icon: <div className="w-32 h-32 relative">
      <div className="absolute inset-0 bg-emerald-400/15 blur-2xl rounded-full"></div>
      <svg className="w-full h-full text-emerald-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  },
  {
    title: "Master Yield Farming",
    description: "Step-by-step guides to structure, compare, and manage yield strategies across risk buckets.",
    buttonText: "Explore Strategies",
    color: "bg-emerald-500",
    href: "/strategies",
    icon: <div className="w-32 h-32 relative">
      <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full"></div>
      <svg className="w-full h-full text-emerald-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  },
  {
    title: "DeFi Security Guide",
    description: "Understand the key risk vectors in DeFi and how our rating framework evaluates protocol safety.",
    buttonText: "Read Security Research",
    color: "bg-emerald-500",
    href: "/research",
    icon: <div className="w-32 h-32 relative">
      <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full"></div>
      <svg className="w-full h-full text-blue-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </div>
  },
  {
    title: "About DeFi Sentinel",
    description: "Learn who we are, how we rate protocols, and what drives our mission for safer DeFi.",
    buttonText: "About Us",
    color: "bg-emerald-500",
    href: "/about",
    icon: <div className="w-32 h-32 relative">
      <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full"></div>
      <svg className="w-full h-full text-emerald-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
  }
];

export function AcademyCarousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <section className="max-w-6xl mx-auto relative animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academy & Guides</h2>
      </div>

      <div className="relative group">
        {/* Main Slide Container */}
        <div className="bg-gradient-to-r from-emerald-50 via-gray-50 to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-900/20 rounded-[32px] p-8 md:p-16 overflow-hidden min-h-[320px] flex items-center relative border border-gray-200 dark:border-gray-800">

          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Image/Icon Side */}
            <div className="order-2 md:order-1 flex-shrink-0 transform transition-transform duration-500 hover:scale-105">
              {carouselItems[carouselIndex].icon}
            </div>

            {/* Content Side */}
            <div className="order-1 md:order-2 flex-1 text-center md:text-left max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {carouselItems[carouselIndex].title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                {carouselItems[carouselIndex].description}
              </p>
              <Link
                href={carouselItems[carouselIndex].href}
                className="inline-flex px-8 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-transform hover:scale-105 active:scale-95"
              >
                {carouselItems[carouselIndex].buttonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700 transition-all z-20 transform scale-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700 transition-all z-20 transform scale-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCarouselIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === carouselIndex ? 'w-8 bg-white' : 'w-4 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
