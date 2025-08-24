"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Draggable3DImageRing } from "@/components/ui/draggable-3d-image-ring";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Code,
  GitBranch,
  Rocket,
  Star,
  Terminal,
  Users
} from "lucide-react";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

// Configuration and Data
const MARQUEE_IMAGES = [
  { src: '/images/1.png', alt: 'Linux', "data-ai-hint": "Linux mascot" },
  { src: '/images/2.png', alt: 'Open Source', "data-ai-hint": "open source code" },
  { src: '/images/3.png', alt: 'BITS Pilani', "data-ai-hint": "university building" },
  { src: '/images/4.png', alt: 'Dubai', "data-ai-hint": "Dubai skyline" },
  { src: '/images/5.png', alt: 'Technology', "data-ai-hint": "futuristic technology" },
  { src: '/images/6.png', alt: 'Community', "data-ai-hint": "diverse community" },
  { src: '/images/7.png', alt: 'Workshops', "data-ai-hint": "coding workshop" },
  { src: '/images/8.png', alt: 'Events', "data-ai-hint": "tech conference" },
];

const STATS_DATA = [
  { icon: Users, label: "Active Members", value: "200+", color: "text-orange-400" },
  { icon: Calendar, label: "Events Hosted", value: "50+", color: "text-blue-400" },
  { icon: GitBranch, label: "Projects", value: "25+", color: "text-green-400" },
  { icon: Star, label: "Years Active", value: "5+", color: "text-purple-400" }
];

const FEATURES_DATA = [
  {
    icon: Code,
    title: "Open Source",
    description: "Dive into the world of open-source development and contribute to projects that matter.",
    color: "orange",
    delay: "0s"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a vibrant community of like-minded individuals passionate about technology.",
    color: "blue",
    delay: "0.2s"
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Push the boundaries of what's possible with cutting-edge tools and technologies.",
    color: "green",
    delay: "0.4s"
  }
];

// Fixed particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: "5%", top: "10%", delay: "0s", duration: "20s" },
  { left: "15%", top: "50%", delay: "2s", duration: "25s" },
  { left: "25%", top: "30%", delay: "4s", duration: "15s" },
  { left: "35%", top: "70%", delay: "1s", duration: "18s" },
  { left: "45%", top: "20%", delay: "3s", duration: "22s" },
  { left: "55%", top: "60%", delay: "5s", duration: "17s" },
  { left: "65%", top: "40%", delay: "0.5s", duration: "23s" },
  { left: "75%", top: "80%", delay: "4.5s", duration: "19s" },
  { left: "85%", top: "15%", delay: "1.5s", duration: "16s" },
  { left: "95%", top: "55%", delay: "3.5s", duration: "21s" },
];

// Utility Components
const LoadingFallback = () => (
  <div className="w-full h-64 bg-gray-900/20 rounded-lg animate-pulse flex items-center justify-center border border-gray-800">
    <div className="text-gray-400">Loading...</div>
  </div>
);

const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
};

const SubtleGrid = () => (
  <div className="absolute inset-0 opacity-[0.02]">
    <div 
      className="absolute inset-0" 
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  </div>
);

type HeroSectionProps = {
  user: any;
  showSignInButton: boolean;
  showMascot: boolean;
  ringImages: string[];
};

const HeroSection = ({ user, showSignInButton, showMascot, ringImages }: HeroSectionProps) => (
  <section className="relative z-10">
    {/* 3D Image Ring - Hidden on mobile, shown on larger screens */}
    <div className="hidden lg:block absolute inset-0 z-0 opacity-80">
      <Suspense fallback={<LoadingFallback />}>
        <Draggable3DImageRing images={ringImages} />
      </Suspense>
    </div>

    {/* Mobile background pattern */}
    <div className="lg:hidden absolute inset-0 opacity-15">
      <div className="grid grid-cols-3 gap-4 p-4 h-full">
        {MARQUEE_IMAGES.slice(0, 9).map((img, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-gray-800/30 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 768px) 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        ))}
      </div>
    </div>

    {/* Main content */}
    <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[90vh] py-12 lg:py-20">
        {/* Logo and mascot */}
        {showMascot && (
          <div className="mb-8 lg:mb-12 animate-fade-in-down">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/20">
              <Terminal className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
            </div>
          </div>
        )}

        {/* Main heading */}
        <div className="text-center space-y-4 lg:space-y-6 max-w-5xl animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight">
            Linux User Group
          </h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 animate-fade-in-up" 
              style={{animationDelay: '0.2s'}}>
            BPDC
          </h2>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in-up" 
             style={{animationDelay: '0.4s'}}>
            Welcome to the home of{" "}
            <span className="text-blue-400 font-semibold">open-source</span>{" "}
            enthusiasts at{" "}
            <span className="text-orange-400 font-semibold">BITS Pilani Dubai Campus</span>.
          </p>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 lg:pt-12 px-4 animate-fade-in-up" 
               style={{animationDelay: '0.6s'}}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/events">
                <Calendar className="mr-2 h-5 w-5" />
                Join Our Events
              </Link>
            </Button>
            
            {showSignInButton && (
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-bold px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 bg-transparent"
                asChild
              >
                <Link href="/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
              </Button>
            )}
          </div> */}
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="py-16 lg:py-24 relative z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            About <span className="text-orange-400">LUG</span>
          </h2>
        </div>

        <Card className="bg-gray-900/30 border border-gray-800/50 backdrop-blur-sm shadow-2xl animate-fade-in-up">
          <CardContent className="p-8 sm:p-10 lg:p-12">
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed text-center">
              At <span className="text-orange-400 font-semibold">LUG</span>, we believe in the power of open-source technology and the freedom to create, 
              share, and innovate. Our community brings together students passionate about{" "}
              <span className="text-blue-400 font-semibold">Linux</span>, 
              open-source software, and collaborative development. From beginners to experts, we 
              explore system administration, scripting, and cutting-edge tools through{" "}
              <span className="text-green-400 font-semibold">workshops</span>,{" "}
              <span className="text-purple-400 font-semibold">install fests</span>, and discussions. 
              At LUG, <span className="text-yellow-400 font-semibold">curiosity drives learning</span>, 
              collaboration fuels growth, and innovation thrives.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-16 lg:py-24 relative z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
        {FEATURES_DATA.map((feature, index) => (
          <Card 
            key={index}
            className="bg-gray-900/30 border border-gray-800/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-500 group hover:shadow-xl hover:scale-105 animate-fade-in-up"
            style={{animationDelay: feature.delay}}
          >
            <CardHeader className="text-center pb-4">
              <div className={`w-20 h-20 mx-auto bg-${feature.color}-500/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/30 transition-all duration-300 shadow-lg`}>
                <feature.icon className={`w-10 h-10 text-${feature.color}-400`} />
              </div>
              <CardTitle className="text-2xl lg:text-3xl text-white font-bold">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-16 lg:py-20 relative z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Our <span className="text-orange-400">Impact</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up" 
           style={{animationDelay: '0.2s'}}>
          Building the future of open-source technology together
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {STATS_DATA.map((stat, index) => (
          <Card 
            key={index}
            className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-500 group text-center animate-fade-in-up"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm lg:text-base text-gray-400">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const TechShowcase = () => (
  <section className="py-16 lg:py-20 relative z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Technologies We <span className="text-blue-400">Explore</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
        {MARQUEE_IMAGES.slice(0, 8).map((img, index) => (
          <div
            key={index}
            className="relative group animate-fade-in-up"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300 group-hover:scale-105">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-white font-semibold text-sm text-center">
                  {img.alt}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// Main Component
export default function Home() {
  const { user, isAdmin, featureFlags } = useAuth();
  const showSignInButton = !user && (featureFlags?.showSignIn ?? true);
  const showMascot = featureFlags?.showMascot ?? true;
  const ringImages = MARQUEE_IMAGES.map(img => img.src);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Elements */}
      <SubtleGrid />
      <FloatingParticles />
      
      {/* Very subtle gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/5 to-black" /> */}

      {/* Page Sections */}
      <HeroSection 
        user={user}
        showSignInButton={showSignInButton}
        showMascot={showMascot}
        ringImages={ringImages}
      />
      
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <TechShowcase />
    </div>
  );
}