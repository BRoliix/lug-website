"use client";
import Carousel3D, { Carousel3DItem } from "@/components/carousel-3d";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Target, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [activeCard, setActiveCard] = useState(0);

  const carouselItems: Carousel3DItem[] = [
    {
      id: 1,
      title: "Who We Are",
      brand: "Community",
      description: "At LUG, we believe in the power of open-source technology and the freedom to create, share, and innovate. Our community brings together students passionate about Linux, open-source software, and collaborative development. From beginners to experts, we explore system administration, scripting, and cutting-edge tools through workshops, install fests, and discussions. At LUG, curiosity drives learning, collaboration fuels growth, and innovation thrives.",
      tags: ["Open Source", "Collaboration", "Linux"],
      imageUrl: "/images/who.png",
      link: "https://www.linkedin.com/company/lugbpdc/"
    },
    {
      id: 2,
      title: "Our Mission",
      brand: "Vision",
      description: "Our mission is to ignite a passion for open-source technology by fostering a collaborative environment for learning and innovation. We empower students with the practical skills and hands-on experience necessary to thrive in their future careers.",
      tags: ["Innovation", "Skills", "Technology"],
      imageUrl: "/images/mission.png",
      link: "/events"
    },
    {
      id: 3,
      title: "What We Do",
      brand: "Activities",
      description: "From hands-on workshops and collaborative coding projects to expert-led tech talks and lively install fests, we offer a wide range of activities. Our community thrives on exploring everything from system administration to cutting-edge development, providing a space for members to share knowledge, seek guidance, and innovate together.",
      tags: ["Workshops", "Projects", "Talks"],
      imageUrl: "/images/what.png",
      link: "https://www.instagram.com/lugbpdc/"
    }
  ];

  const getIcon = (index: number) => {
    const icons = [Users, Target, Activity];
    return icons[index] || Users;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">
            About <span className="text-orange-400">LUG</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Learn more about our community and what drives us.
          </p>
        </div>

        {/* Desktop Carousel - Hidden on mobile */}
        <div className="hidden lg:block">
          <Carousel3D items={carouselItems} />
        </div>

        {/* Mobile/Tablet Cards - Visible on mobile and tablet */}
        <div className="lg:hidden space-y-6">
          {carouselItems.map((item, index) => {
            const IconComponent = getIcon(index);
            return (
              <Card 
                key={item.id} 
                className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-48 sm:h-56 rounded-t-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Brand Badge */}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {item.brand}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-orange-400" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <div className="pt-2">
                    <Button
                      asChild
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 transition-all duration-300"
                    >
                      <Link 
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : '_self'}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-center gap-2"
                      >
                        Learn more
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
