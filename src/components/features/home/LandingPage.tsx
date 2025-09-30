"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  Smartphone, 
  Globe, 
  MessageCircle,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Bot,
  Sparkles,
  Star,
  ChevronDown,
  User
} from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthModal } from '@/components/shared/auth/AuthModal';
import { useAuthStore } from '@/state/authStore';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';

export const Landing: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />
      
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Main Hero Content */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">AI-Powered Business Analysis</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
              Unlock the Power of
              <span className="block bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Your Data
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/80 font-light">
                — Effortlessly
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your business data into actionable insights with our AI-powered platform. 
              No technical skills required — just upload, ask, and discover.
          </p>
        </div>

          {/* CTA Section simplified: single Continue Analysing button */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <Button 
                onClick={isAuthenticated ? () => router.push('/dashboard') : handleSignIn}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue Analysing
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>10,000+ Businesses</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <span>99.9% Uptime</span>
            </div>
          </div>

          {/* Scroll Indicator removed per request */}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="relative z-10 bg-white">
        {/* Section 1: Trust & Confidence */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">1️⃣</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">Trust & Confidence at Every Step</h2>
                </div>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  We understand that your business data is precious. That's why all your files stay secure on our servers, 
                  giving you peace of mind while you explore insights. Our AI-powered analysis is designed for accuracy and 
                  reliability, helping you make confident decisions without second-guessing.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">No technical skills required — just upload your CSV/Excel files</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Connect Shopify for seamless e-commerce insights</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Start discovering insights within minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 backdrop-blur-sm border border-red-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Shield className="h-8 w-8 text-red-500 mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
                      <p className="text-sm text-gray-600">Enterprise-grade security for your data</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Brain className="h-8 w-8 text-red-500 mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">AI Accuracy</h3>
                      <p className="text-sm text-gray-600">Reliable insights you can trust</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <Zap className="h-8 w-8 text-red-500 mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                      <p className="text-sm text-gray-600">Get insights in minutes, not hours</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <FileSpreadsheet className="h-8 w-8 text-red-500 mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
                      <p className="text-sm text-gray-600">Drag & drop your files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Designed for Ease */}
        <section className="py-24 px-4 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 backdrop-blur-sm border border-blue-100">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <Globe className="h-8 w-8 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Web Dashboard</h3>
                      </div>
                      <p className="text-gray-600">Deep, visual exploration of your data</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <Smartphone className="h-8 w-8 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Shopify Plugin</h3>
                      </div>
                      <p className="text-gray-600">Seamless e-commerce insights</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <MessageCircle className="h-8 w-8 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">WhatsApp Bot</h3>
                      </div>
                      <p className="text-gray-600">Quick, on-the-go analysis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8 order-1 lg:order-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">2️⃣</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">Designed for Ease, Wherever You Are</h2>
                </div>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Running a business is hectic — your data tools shouldn't add complexity. That's why we meet you where you work.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Ask questions naturally, see results instantly</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Files are supported out-of-the-box</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">No formatting headaches, no confusing interfaces</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 removed per instruction */}

        {/* Section 4: Premium Experience */}
        <section className="py-24 px-4 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">4️⃣</span>
                  </div>
                  <h2 className="text-4xl font-bold">A Premium Experience, Built for You</h2>
                </div>
                
                <p className="text-xl text-white/80 leading-relaxed">
                  Step into a modern, sleek interface with a glassmorphic, minimal design that feels both professional and approachable. 
                  Every component is carefully crafted — sharp yet approachable, with blood-red accents highlighting the actions that matter.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Glassmorphic, minimal design</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Professional yet approachable</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Sharp yet curved aesthetics</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Blood-red accents for key actions</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white">Modern Interface</h3>
                      </div>
                      <p className="text-white/70 text-sm">Clean, intuitive design that empowers you</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <Star className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white">Premium Feel</h3>
                      </div>
                      <p className="text-white/70 text-sm">Sophisticated yet accessible experience</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <Zap className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white">Action-Oriented</h3>
                      </div>
                      <p className="text-white/70 text-sm">Every element guides you to the next step</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Features */}
        <section className="py-24 px-4 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">5️⃣</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Features That Make Your Life Easier</h2>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Core Features</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instant CSV/Excel Analysis</h4>
                      <p className="text-gray-600">Upload and analyze your data in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Conversational AI</h4>
                      <p className="text-gray-600">Chat directly with your data in natural language</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shopify Integration</h4>
                      <p className="text-gray-600">Real-time insights from your e-commerce store</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Bot</h4>
                      <p className="text-gray-600">Analysis wherever you are, whenever you need it</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Bonus Features</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Automatic Trend Detection</h4>
                      <p className="text-gray-600">Get actionable recommendations automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Download className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Export Insights</h4>
                      <p className="text-gray-600">Download reports in CSV/PDF format</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Multi-Device Access</h4>
                      <p className="text-gray-600">Cross-platform compatibility</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Future-Ready</h4>
                      <p className="text-gray-600">Integrations for your growing business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Why SMB Owners Love Us */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-600">6️⃣</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Why SMB Owners Love Us</h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Empowering</h3>
                <p className="text-gray-600">Make data-driven decisions without hiring analysts</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Time-saving</h3>
                <p className="text-gray-600">No more manual spreadsheets or confusing dashboards</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trustworthy</h3>
                <p className="text-gray-600">Reliable AI, secure platform, actionable insights</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fun & Approachable</h3>
                <p className="text-gray-600">Chat with your data like you would with a human assistant</p>
          </div>
        </div>
      </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Transform Your Business?</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of business owners who are already making smarter decisions with their data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted} 
                className="px-8 py-4 bg-white text-red-600 hover:bg-hover font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSignIn} 
                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold text-lg rounded-2xl border border-white/30"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode={authMode} />
    </div>
  );
};

export default Landing;


