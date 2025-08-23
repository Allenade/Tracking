"use client";

import Image from "next/image";
import Navbar from "../../components/Navbar";
import { useTranslation } from "../../hooks/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl mb-8 opacity-90">
            Secure Lanes at your doorstep in the blink of an eye
          </p>
          <div className="w-24 h-1 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              When Michael Carter, Sarah Whitmore, and Jason Lee founded Secure
              Lanes in 2010, they had no idea they would transform the logistics
              industry. Today, Secure Lanes stands as a global leader in secure
              logistics. With a dedicated team of over 150,000 employees across
              180 countries, we work tirelessly to help you break barriers,
              expand into new markets, and scale your business. Or simply
              deliver a special package to someone you care about.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                150,000
              </div>
              <div className="text-gray-700">People working with us</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                Over 180
              </div>
              <div className="text-gray-700">
                Countries and territories served
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                $90.1 billion
              </div>
              <div className="text-gray-700">Revenue generated last year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sustainability */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/sustainability-team.jpg"
                  alt="Sustainability Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Sustainability</h3>
                <p className="text-gray-700">
                  Secure Lanes is dedicated to sustainability by adopting
                  eco-friendly practices that reduce carbon emissions and
                  promote green logistics.
                </p>
              </div>
            </div>

            {/* Technology */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/warehouse-tech.jpg"
                  alt="Warehouse Technology"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Technology</h3>
                <p className="text-gray-700">
                  Through advanced technology partnerships, Secure Lanes
                  collaborates with companies that share a commitment to
                  innovative solutions, creating efficient supply chains.
                </p>
              </div>
            </div>

            {/* Careers */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/career-growth.jpg"
                  alt="Career Growth"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Careers</h3>
                <p className="text-gray-700">
                  With a focus on innovation and efficiency, Secure Lanes offers
                  promising career opportunities for individuals passionate
                  about making a difference in the logistics industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Using core values to create smarter supply chains
            </h2>
            <p className="text-xl text-gray-600">
              Flexibility, efficiency, and intelligence are at the heart of our
              efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Flexibility */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Flexibility</h3>
              <p className="text-gray-700">
                Providing a seamless delivery experience for customers through
                the integrated Secure Lanes Network. Empowering businesses to
                optimize their operations with advanced logistics services,
                automation, and real-time supply chain visibility.
              </p>
            </div>

            {/* Efficiency */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Efficiency</h3>
              <p className="text-gray-700">
                Enhancing how we collect, transport, and deliver packages with
                the Secure Lanes Network. Committed to sustainability efforts,
                such as lowering emissions and helping businesses monitor their
                carbon footprints. We consistently meet customer and regulatory
                standards, backed by our global ISO 9001 certification.
              </p>
            </div>

            {/* Intelligence */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Intelligence</h3>
              <p className="text-gray-700">
                Providing data-driven insights to empower businesses in making
                informed decisions. Leveraging our Quality Management principles
                to turn innovative ideas from concept to reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start your own story</h2>
          <p className="text-xl mb-8 opacity-90">
            Join a team who&apos;s all in for their coworkers, customers, and
            communities. Check back often for new opportunities.
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors">
            JOIN US
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logos.jpeg"
                    alt="Secure Lanes Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Secure Lanes</span>
              </div>
              <p className="text-gray-400">
                Professional shipping and logistics services worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    News
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Air Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sea Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Ground Transport
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Headquarters: New York, NY</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Email: info@securelanes.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© Secure Lanes Copyright. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
