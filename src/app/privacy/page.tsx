import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — CreatorTok",
  description: "Privacy Policy for CreatorTok",
};

export default function PrivacyPage() {
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
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: April 21, 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong className="text-white">CreatorTok</strong> ("we", "our", or "us"). CreatorTok is a
              social media scheduling platform that helps creators and agencies manage and schedule TikTok content across
              multiple accounts. This Privacy Policy explains what information we collect, how we use it, and how we
              protect it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">When you connect your TikTok account to CreatorTok, we collect the following information via the official TikTok API:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-white">TikTok username</strong> — to identify and display your connected account.</li>
              <li><strong className="text-white">Profile avatar</strong> — to display your profile image within the dashboard.</li>
              <li><strong className="text-white">Access token &amp; refresh token</strong> — securely stored and used exclusively to publish scheduled videos on your behalf through the official TikTok API.</li>
            </ul>
            <p className="mt-3">
              We also collect standard account registration data (email address and password hash) when you create a CreatorTok account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>To authenticate you and provide access to the CreatorTok dashboard.</li>
              <li>To publish videos to your TikTok account at your scheduled times using the official TikTok Content Posting API.</li>
              <li>To display your TikTok profile information within the app.</li>
              <li>To maintain and improve our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. How We Store and Protect Your Data</h2>
            <p>
              All access tokens and refresh tokens are stored in an encrypted database. We never store your TikTok password.
              Tokens are only transmitted over HTTPS and are used solely for the purpose of scheduling and publishing content on
              your behalf. You may revoke access at any time by disconnecting your TikTok account from the CreatorTok dashboard
              or through TikTok's own security settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p>
              CreatorTok integrates with the <strong className="text-white">TikTok for Developers API</strong>. Your use of
              CreatorTok is also subject to TikTok's own{" "}
              <a
                href="https://www.tiktok.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Privacy Policy
              </a>
              . We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You may request deletion of your account and all
              associated data at any time by contacting us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
