"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Pham Duong",
    title: "VP Sales & Marketing",
    company: "Ohio Bag Corp",
    image: "/images/profile-1.jpg",
    content:
      "Tại một cảng mới..... Sử dụng chúng để giao nhận hàng hóa, môi giới hải quan và vận tải đường bộ nội địa cho phép chúng tôi duy trì luồng thông suốt từ khi hàng hóa rời khỏi cho đến thời điểm họ đến cửa khách hàng của chúng tôi và tôi có thể truy cập theo dõi thời gian thực trên đường đi.",
  },
  {
    id: 2,
    name: "Jabin Kane",
    title: "Logistics Manager",
    company: "Houghton Chemical Corp",
    image: "/images/profile-2.jpg",
    content:
      "We've been working with Secure Lanes for over two years now. Their team handles our complex shipping requirements with exceptional professionalism. The real-time tracking and proactive communication make our logistics operations seamless and reliable.",
  },
  {
    id: 3,
    name: "Tom Battat",
    title: "CEO",
    company: "TopSMMPanel.com",
    image: "/images/profile-3.jpg",
    content:
      "Secure Lanes helped us navigate complex customs regulations and got our goods cleared efficiently. Their expertise in international shipping and attention to detail exceeded our expectations. Highly recommended for any business.",
  },
  {
    id: 4,
    name: "Sarah Chen",
    title: "Operations Director",
    company: "Global Tech Solutions",
    image: "/images/profile-4.jpg",
    content:
      "The level of service we receive from Secure Lanes is outstanding. Their attention to detail and proactive approach to logistics challenges has significantly improved our supply chain efficiency. They truly understand our business needs.",
  },
];

export default function TestimonialsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-blue-500 text-sm font-semibold uppercase tracking-wide mb-2">
            TESTIMONIAL
          </h3>
          <h2 className="text-4xl font-bold text-gray-900">Our Clients Say!</h2>
        </div>

        <div className="relative">
          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg shadow-lg p-8 relative max-w-2xl mx-auto">
                    <div className="absolute top-4 left-4 text-gray-200 text-6xl font-serif">
                      &quot;
                    </div>
                    <div className="flex items-center mb-6 mt-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-red-500"
                  : "bg-red-300 hover:bg-red-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
