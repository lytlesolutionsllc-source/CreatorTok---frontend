import Link from "next/link";

export const metadata = {
  title: "Terms of Service — CreatorTok",
  description: "Terms of Service for CreatorTok",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">
          Terms of <span className="gradient-text">Service</span>
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: April 21, 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using <strong className="text-white">CreatorTok</strong> ("the Service"), you agree
              to be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              CreatorTok is a social media scheduling platform that allows users to connect their TikTok accounts and schedule
              video content for automatic publishing. We use the official{" "}
              <strong className="text-white">TikTok for Developers API</strong> (including Login Kit and Content Posting API)
              to authenticate users and publish content on their behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
            <p className="mb-3">By using CreatorTok, you agree that:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>You are solely responsible for all content you schedule and publish through the Service.</li>
              <li>
                All content you publish must comply with{" "}
                <a
                  href="https://www.tiktok.com/community-guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  TikTok's Community Guidelines
                </a>{" "}
                and{" "}
                <a
                  href="https://www.tiktok.com/legal/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms of Service
                </a>
                .
              </li>
              <li>You will not use CreatorTok to publish spam, misleading content, or content that violates any applicable laws.</li>
              <li>You own or have the necessary rights and licenses for all content you upload and schedule.</li>
              <li>You are responsible for maintaining the security of your CreatorTok account credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. TikTok API Usage</h2>
            <p>
              CreatorTok accesses TikTok on your behalf using official TikTok APIs. By connecting your TikTok account, you
              authorize CreatorTok to publish scheduled videos and retrieve your basic profile information (username and avatar)
              using the permissions you grant during the TikTok OAuth login flow. You may revoke this authorization at any
              time through your TikTok account settings or your CreatorTok dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms of Service, abuse the TikTok API,
              or engage in any activity that harms our users or services. You may delete your account at any time by contacting
              us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimer of Warranties</h2>
            <p>
              CreatorTok is provided "as is" without warranties of any kind. We do not guarantee that the Service will be
              uninterrupted, error-free, or that scheduled posts will always publish successfully (e.g., due to TikTok API
              outages). We are not liable for any missed posts or loss resulting from Service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the Service after any changes constitutes
              your acceptance of the new terms. We will notify users of material changes via email or an in-app notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@creatortok.app" className="text-purple-400 hover:text-purple-300 underline">
                support@creatortok.app
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/" className="btn-primary inline-block text-center">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
