// Better Together: Privacy Policy Page
import { html } from 'hono/html'

export const privacyPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Better Together</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      color: #FF6B9D;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    .last-updated {
      color: #666;
      margin-bottom: 30px;
      font-size: 0.9rem;
    }
    h2 {
      color: #C44569;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    p, li {
      margin-bottom: 15px;
      color: #444;
    }
    ul {
      margin-left: 25px;
      margin-bottom: 20px;
    }
    a {
      color: #FF6B9D;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 30px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">← Back to Better Together</a>

    <h1>Privacy Policy</h1>
    <p class="last-updated">Last Updated: December 27, 2025</p>

    <p>At Better Together ("we," "our," or "us"), we are committed to protecting your privacy and the privacy of your relationship data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.</p>

    <h2>Information We Collect</h2>

    <h3>Information You Provide</h3>
    <ul>
      <li><strong>Account Information:</strong> Email address, name, and optional profile photo</li>
      <li><strong>Relationship Data:</strong> Partner connection, relationship type, anniversary dates</li>
      <li><strong>Check-in Data:</strong> Daily mood scores, connection ratings, gratitude notes</li>
      <li><strong>Goals & Activities:</strong> Shared goals, planned activities, important dates</li>
      <li><strong>Communications:</strong> Messages with our AI coach, support inquiries</li>
    </ul>

    <h3>Automatically Collected Information</h3>
    <ul>
      <li>Device information (type, operating system, unique identifiers)</li>
      <li>Usage data (features used, session duration, interaction patterns)</li>
      <li>Crash reports and performance data</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <ul>
      <li>Provide and improve our relationship wellness services</li>
      <li>Generate personalized insights and AI-powered suggestions</li>
      <li>Send notifications about check-ins, goals, and important dates</li>
      <li>Analyze usage patterns to enhance app features</li>
      <li>Respond to your support requests</li>
      <li>Ensure security and prevent fraud</li>
    </ul>

    <h2>Data Sharing and Disclosure</h2>
    <p>We do NOT sell your personal information. We may share data only in these circumstances:</p>
    <ul>
      <li><strong>With Your Partner:</strong> Shared relationship data is visible to your connected partner</li>
      <li><strong>Service Providers:</strong> Trusted third parties who help operate our services (hosting, analytics)</li>
      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
      <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
    </ul>

    <h2>Data Security</h2>
    <p>We implement industry-standard security measures to protect your information:</p>
    <ul>
      <li>Encryption in transit (TLS/SSL) and at rest</li>
      <li>Secure cloud infrastructure</li>
      <li>Regular security audits</li>
      <li>Access controls and authentication</li>
    </ul>

    <h2>Your Privacy Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li><strong>Access:</strong> Request a copy of your personal data</li>
      <li><strong>Correction:</strong> Update inaccurate information</li>
      <li><strong>Deletion:</strong> Request deletion of your account and data</li>
      <li><strong>Export:</strong> Download your data in a portable format</li>
      <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
    </ul>

    <h2>Data Retention</h2>
    <p>We retain your data while your account is active. Upon account deletion, we remove your personal data within 30 days, except where retention is required by law.</p>

    <h2>Children's Privacy</h2>
    <p>Better Together is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.</p>

    <h2>International Data Transfers</h2>
    <p>Your information may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.</p>

    <h2>Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email.</p>

    <h2>Contact Us</h2>
    <p>If you have questions about this Privacy Policy or your data, contact us at:</p>
    <p>
      <strong>Email:</strong> <a href="mailto:privacy@aiacrobatics.com">privacy@aiacrobatics.com</a><br>
      <strong>Address:</strong> AI Acrobatics LLC, United States
    </p>

    <h2>California Privacy Rights</h2>
    <p>California residents have additional rights under the CCPA, including the right to know what personal information is collected and how it's used, and the right to opt-out of the sale of personal information. As noted above, we do not sell personal information.</p>

  </div>
</body>
</html>
`
