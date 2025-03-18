import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import {
  CheckCircle2,
  UserPlus,
  MousePointer,
  Upload,
  Bolt,
  UserCheck,
  Headphones,
  ThumbsUp,
  Smartphone,
  DollarSign,
  Star,
} from "lucide-react";

// Helper function to get icon component by name
const getIconByName = (iconName: string) => {
  switch (iconName) {
    case "fa-id-card":
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>;
    case "fa-credit-card":
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
    case "fa-id-badge":
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>;
    case "fa-building":
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    default:
      return <Bolt className="h-6 w-6" />;
  }
};

export default function HomePage() {
  // Fetch featured services (using first 4)
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const featuredServices = services?.filter(service => 
    ['Aadhaar Card', 'PAN Card', 'Income Certificate', 'Domicile Certificate', 'Birth Certificate', 'Passport', 'Marriage Certificate', 'GST Registration']
    .includes(service.name)
  ) || [];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div id="home" className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100"></polygon>
            </svg>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Fast & Reliable</span>
                  <span className="block text-primary-600 xl:inline"> Document Services</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  QuickTech helps you process essential documents like Aadhaar, PAN card, driving license, and more. Submit documents online and we'll handle the rest.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/services">
                      <Button className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#how-it-works">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10">
                        How It Works
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Document processing services" />
        </div>
      </div>

      {/* Service Categories Section */}
      <section id="services" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Services</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">Document Services We Offer</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Choose from our wide range of government and essential document services.</p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                // Loading skeleton
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gray-200 rounded-md p-3 h-12 w-12"></div>
                        <div className="ml-5 w-3/4">
                          <div className="h-5 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="mt-4 w-full">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="mt-4">
                        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="mt-5">
                        <div className="h-10 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                featuredServices.map((service) => (
                  <div key={service.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 service-card">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-100 rounded-md p-3 text-primary-600">
                          {getIconByName(service.icon)}
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>{service.description}</p>
                      </div>
                      <div className="mt-4">
                        {service.badge && (
                          <Badge variant="outline" className={`bg-${service.badge_color}-100 text-${service.badge_color}-800`}>
                            {service.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-5">
                        <Link href={`/services/${service.id}`}>
                          <Button className="text-sm">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/services">
                <Button variant="outline" className="px-6 py-3">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Process</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">How It Works</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Simple 4-step process to get your documents processed with ease.</p>
          </div>
          
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-lg font-medium text-gray-900">
                  4 Simple Steps
                </span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <UserPlus className="text-primary-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">1. Create Account</h3>
                <p className="mt-2 text-base text-gray-500">Register with your email or phone number to get started.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <MousePointer className="text-primary-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">2. Select Service</h3>
                <p className="mt-2 text-base text-gray-500">Choose the document service you need from our offerings.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <Upload className="text-primary-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">3. Upload Documents</h3>
                <p className="mt-2 text-base text-gray-500">Upload required documents and provide necessary information.</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                  <CheckCircle2 className="text-primary-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">4. Track & Receive</h3>
                <p className="mt-2 text-base text-gray-500">Pay the service fee, track progress, and receive your documents.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button className="px-6 py-3">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose QuickTech
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We make document processing simple, fast, and hassle-free.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <Bolt />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fast Processing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get your documents processed quickly without waiting in long government queues.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <UserCheck />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">100% Secure</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your documents and personal information are protected with advanced security measures.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <Headphones />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">24/7 Support</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our customer support team is available around the clock to assist you with any queries.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <ThumbsUp />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Guaranteed Delivery</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We ensure your documents are processed correctly and delivered on time.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <Smartphone />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Track Anywhere</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track your document status from anywhere, anytime using our mobile-friendly platform.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <DollarSign />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Transparent Pricing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Clear pricing with no hidden costs or surprise fees at any stage of the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-4xl">What Our Customers Say</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Don't just take our word for it - hear from our satisfied customers.</p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" alt="Customer" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Priya Sharma</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "I needed my Aadhaar card updated urgently and QuickTech made it happen in just 2 days! Incredible service and very professional staff. Highly recommended!"
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" alt="Customer" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Rajesh Kumar</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 fill-current" fill="none" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "Getting my driving license renewed was a breeze with QuickTech. The online process was simple, and they kept me updated at every step. Saved me so much time!"
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" alt="Customer" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Aditya Patel</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  "I needed help with multiple documents for my new business. The team at QuickTech handled everything perfectly - from GST registration to MSME certification. Exceptional service!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-primary-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-300">Sign up and process your documents today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth">
                <Button variant="secondary" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-800 bg-white hover:bg-gray-100">
                  Sign Up
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/services">
                <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
