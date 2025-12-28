// Better Together: Terms of Service Page
import { html } from 'hono/html'

export const termsPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Better Together</title>
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

    <h1>Terms of Service</h1>
    <p class="last-updated">Last Updated: December 27, 2025</p>

    <p>Welcome to Better Together. These Terms of Service ("Terms") govern your use of our mobile application and website (collectively, the "Service"). By using Better Together, you agree to these Terms.</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using Better Together, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Service.</p>

    <h2>2. Description of Service</h2>
    <p>Better Together is a relationship wellness application that helps couples strengthen their connection through daily check-ins, shared goals, AI-powered coaching, and activity planning.</p>

    <h2>3. Account Registration</h2>
    <ul>
      <li>You must provide accurate and complete information when creating an account</li>
      <li>You are responsible for maintaining the security of your account credentials</li>
      <li>You must be at least 13 years old to use the Service</li>
      <li>One person may not maintain more than one account</li>
    </ul>

    <h2>4. User Content</h2>
    <p>You retain ownership of content you submit to Better Together. By submitting content, you grant us a license to use, store, and process that content to provide the Service.</p>
    <p>You agree not to submit content that:</p>
    <ul>
      <li>Is illegal, harmful, or violates others' rights</li>
      <li>Contains malware or malicious code</li>
      <li>Impersonates another person</li>
      <li>Violates any applicable laws or regulations</li>
    </ul>

    <h2>5. Partner Connections</h2>
    <p>When you connect with a partner on Better Together:</p>
    <ul>
      <li>Both parties must consent to the connection</li>
      <li>Certain data will be shared between connected partners</li>
      <li>Either party may disconnect the partnership at any time</li>
    </ul>

    <h2>6. AI Coach Disclaimer</h2>
    <p>The AI Coach feature provides general relationship guidance and suggestions. It is NOT a substitute for professional counseling, therapy, or medical advice. If you are experiencing relationship difficulties or mental health concerns, please consult a qualified professional.</p>

    <h2>7. Subscription and Payments</h2>
    <ul>
      <li>Some features require a paid subscription</li>
      <li>Subscriptions automatically renew unless cancelled</li>
      <li>Prices may change with notice</li>
      <li>Refunds are handled according to the app store's policies</li>
    </ul>

    <h2>8. Intellectual Property</h2>
    <p>Better Together and its content, features, and functionality are owned by AI Acrobatics LLC and are protected by intellectual property laws. You may not copy, modify, or distribute our Service without permission.</p>

    <h2>9. Prohibited Activities</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use the Service for any unlawful purpose</li>
      <li>Attempt to gain unauthorized access to our systems</li>
      <li>Interfere with other users' use of the Service</li>
      <li>Reverse engineer or decompile the application</li>
      <li>Use automated systems to access the Service</li>
    </ul>

    <h2>10. Termination</h2>
    <p>We may suspend or terminate your account if you violate these Terms. You may delete your account at any time through the app settings.</p>

    <h2>11. Disclaimers</h2>
    <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.</p>

    <h2>12. Limitation of Liability</h2>
    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI ACROBATICS LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.</p>

    <h2>13. Indemnification</h2>
    <p>You agree to indemnify and hold harmless AI Acrobatics LLC from any claims arising from your use of the Service or violation of these Terms.</p>

    <h2>14. Changes to Terms</h2>
    <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

    <h2>15. Governing Law</h2>
    <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.</p>

    <h2>16. Contact</h2>
    <p>For questions about these Terms, contact us at:</p>
    <p>
      <strong>Email:</strong> <a href="mailto:legal@aiacrobatics.com">legal@aiacrobatics.com</a><br>
      <strong>Address:</strong> AI Acrobatics LLC, United States
    </p>

  </div>
</body>
</html>
`
