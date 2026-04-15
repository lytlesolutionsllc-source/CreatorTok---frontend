"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const features = [
  {
    icon: "📅",
    title: "Content Calendar",
    description:
      "Visualize and plan all your TikTok content across multiple accounts in one unified calendar view.",
  },
  {
    icon: "🔗",
    title: "Multi-Account Management",
    description:
      "Connect and manage unlimited TikTok accounts from a single dashboard without switching apps.",
  },
  {
    icon: "⏰",
    title: "Smart Scheduling",
    description:
      "Schedule posts at optimal times automatically based on your audience's peak engagement hours.",
  },
  {
    icon: "📊",
    title: "Analytics & Insights",
    description:
      "Track performance metrics, monitor growth, and understand what content resonates most.",
  },
  {
    icon: "🤝",
    title: "Team Collaboration",
    description:
      "Collaborate with your team, assign roles, and streamline content approval workflows.",
  },
  {
    icon: "🚀",
    title: "Bulk Upload",
    description:
      "Upload and schedule dozens of videos at once with our powerful batch processing tool.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Now in Beta — Join the Waitlist
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Manage All Your{" "}
            <span className="gradient-text">TikTok Accounts</span>
            <br />
            From One Place
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            CreatorTok is the all-in-one content calendar and scheduling
            platform built for TikTok creators, agencies, and brands managing
            multiple accounts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary inline-block text-center">
              Go to Dashboard
            </Link>
            <button className="btn-secondary">Watch Demo</button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10K+", label: "Creators" },
              { value: "50M+", label: "Posts Scheduled" },
              { value: "500+", label: "Agencies" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-brand-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Scale on TikTok</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Purpose-built tools for creators and agencies who manage multiple
              TikTok accounts and need to stay organized.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">Take Control</span> of
            Your TikTok Strategy?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of creators who use CreatorTok to save time, grow
            faster, and stay consistent across all their accounts.
          </p>
          <Link href="/dashboard" className="btn-primary inline-block">
            Start for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
