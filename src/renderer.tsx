import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Better Together - Relationship Intelligence Platform</title>
        <meta name="description" content="The world's first AI-powered relationship assistant that talks with you, schedules meaningful experiences for your partner, and intelligently suggests personalized activities to deepen your bond." />
        <meta name="keywords" content="AI relationship coach, relationship assistant, smart scheduling, couple activities, love languages, relationship psychology, AI dating, partner planning, relationship goals, intelligent suggestions" />
        <meta property="og:title" content="Better Together - Relationship Intelligence Platform" />
        <meta property="og:description" content="The world's first AI-powered relationship assistant that talks with you, schedules experiences for your partner, and suggests personalized activities to deepen your bond." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/static/styles.css" rel="stylesheet" />
        
        <style>
          {`
            body { 
              font-family: 'Inter', sans-serif; 
            }
            
            /* Enhanced Animations */
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fade-in-left {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes fade-in-right {
              from {
                opacity: 0;
                transform: translateX(30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes slide-in-bottom {
              from {
                opacity: 0;
                transform: translateY(50px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes scale-in {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-15px) rotate(5deg); }
            }
            
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
              50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.8); }
            }
            
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            /* Animation Classes */
            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
            }
            
            .animate-fade-in-left {
              animation: fade-in-left 0.8s ease-out forwards;
            }
            
            .animate-fade-in-right {
              animation: fade-in-right 0.8s ease-out forwards;
            }
            
            .animate-slide-in-bottom {
              animation: slide-in-bottom 0.8s ease-out forwards;
            }
            
            .animate-scale-in {
              animation: scale-in 0.6s ease-out forwards;
            }
            
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
            
            .animate-glow {
              animation: glow 2s ease-in-out infinite alternate;
            }
            
            .animate-gradient-shift {
              background-size: 200% 200%;
              animation: gradient-shift 3s ease infinite;
            }
            
            /* Hover Effects */
            .hover-lift {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .hover-lift:hover {
              transform: translateY(-5px) scale(1.02);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            
            .hover-glow {
              transition: all 0.3s ease;
            }
            
            .hover-glow:hover {
              box-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
              transform: scale(1.05);
            }
            
            /* Loading States */
            .loading-spinner {
              animation: spin 1s linear infinite;
            }
            
            /* Smooth Scrolling */
            html {
              scroll-behavior: smooth;
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #ec4899, #8b5cf6);
              border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #db2777, #7c3aed);
            }
          `}
        </style>
      </head>
      <body class="antialiased">{children}</body>
    </html>
  )
})
