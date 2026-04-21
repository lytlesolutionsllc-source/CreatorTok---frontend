"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRef } from "react";

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

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for individual creators just getting started.",
    features: [
      "1 TikTok account",
      "10 scheduled posts/month",
      "Basic analytics",
      "Content calendar",
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious creators and small teams.",
    features: [
      "Up to 5 TikTok accounts",
      "Unlimited scheduled posts",
      "Advanced analytics",
      "Team collaboration (2 seats)",
      "Bulk upload",
      "Priority support",
    ],
    cta: "Start Pro",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    description: "For agencies managing many brands.",
    features: [
      "Unlimited TikTok accounts",
      "Unlimited scheduled posts",
      "Full analytics suite",
      "Unlimited team seats",
      "Bulk upload",
      "Dedicated support",
      "Custom onboarding",
    ],
    cta: "Contact Us",
    href: "/register",
    highlighted: false,
  },
];

const blogPosts = [
  {
    title: "How to Build a Consistent TikTok Posting Schedule",
    excerpt:
      "Consistency is the key to TikTok growth. Learn how top creators plan weeks of content in advance.",
    date: "Apr 15, 2026",
    tag: "Strategy",
  },
  {
    title: "Top 5 Analytics Metrics Every TikTok Creator Should Track",
    excerpt:
      "Move beyond views and followers — here are the numbers that actually predict channel growth.",
    date: "Apr 8, 2026",
    tag: "Analytics",
  },
  {
    title: "Managing Multiple TikTok Accounts Without Burning Out",
    excerpt:
      "Agency pros share their secrets for handling dozens of accounts while staying sane and organised.",
    date: "Apr 1, 2026",
    tag: "Productivity",
  },
];

export default function Home() {
  const featuresRef = useRef<HTMLElement>(null);

  function handleWatchDemo() {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  }

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
            <button className="btn-secondary" onClick={handleWatchDemo}>Watch Demo</button>
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
      <section id="features" ref={featuresRef} className="py-24 px-4 bg-brand-surface/50">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-brand-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 flex flex-col ${
                  plan.highlighted
                    ? "border-purple-500/50 ring-1 ring-purple-500/30"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1 w-fit mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">
                  <span className="gradient-text">{plan.price}</span>
                  <span className="text-lg text-gray-400 font-normal">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`text-center font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-sm ${
                    plan.highlighted ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              From the <span className="gradient-text">Blog</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Tips, strategies, and insights for TikTok creators and agencies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.title}
                className="glass-card p-6 hover:bg-white/10 transition-colors duration-200 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-full px-2 py-0.5">
                    {post.tag}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-base font-semibold mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <button className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors text-left">
                  Read more →
                </button>
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
