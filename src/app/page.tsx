"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import TestimonialsSlider from "../components/TestimonialsSlider";
import WhatsAppButton from "../components/WhatsAppButton";
import { useTranslation } from "../hooks/useTranslation";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-warehouse.jpg"
            alt="Warehouse background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Track Your Shipment
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Get real-time updates on your cargo with our advanced tracking
                system. Experience seamless logistics with Secure Lanes.
              </p>

              <div className="flex justify-center">
                <a
                  href="/track"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  Track Your Shipment
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src="/images/logistics-team.jpg"
                    alt="Logistics team working in warehouse"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Trust Indicators */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Trusted by Thousands
                  </h3>
                  <p className="text-white/90 mb-6">
                    Join thousands of satisfied customers who trust Secure Lanes
                    for their logistics needs. Our commitment to excellence and
                    customer satisfaction sets us apart.
                  </p>
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        10K+
                      </div>
                      <div className="text-white/70">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        99%
                      </div>
                      <div className="text-white/70">On-time Delivery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        24/7
                      </div>
                      <div className="text-white/70">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Your Shipment Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t("trackTitle")}</h2>
          <p className="text-xl mb-8 opacity-90">{t("trackSubtitle")}</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <div className="flex justify-center">
              <Link href="/track">
                <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("trackNow")}</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span>24/7 Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Shipping
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive logistics solutions for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Air Cargo */}
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src="/images/air-cargo.jpg"
                  alt="Air cargo plane on tarmac"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white text-center">
                  Swift And Efficient Air Cargo Services That Connect You
                </h3>
              </div>
            </div>

            {/* Sea Freight */}
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src="/images/container-port.jpg"
                  alt="Container port with shipping containers"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white text-center">
                  Reliable Sea Freight Options For Cost-Effective Shipping
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSlider />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logos.jpeg"
                  alt="Secure Lanes Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Secure Lanes</span>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Track
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Headquarters</li>
                <li>De Kroon</li>
                <li>Trumark 107</li>
                <li>2511 DP Den Haag</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© Secure Lanes Copyright</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton
        phoneNumber="+1234567890"
        message="Hello! I'm interested in Secure Lanes shipping services. Can you help me with a quote?"
      />
    </div>
  );
}
