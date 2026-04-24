// Theme CSS: variables, light/dark mode, responsive breakpoints
export const themeCSS = `
/* ============================================
   GEOMETRIC CREATIVE THEME
   ============================================ */

/* --- CSS Reset --- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { min-height: 100vh; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

/* --- Light Mode: "Paper & Ink" --- */
:root, :root[data-theme="light"] {
  --color-bg:             #FAFAF9;
  --color-bg-secondary:   #F3F2EF;
  --color-bg-tertiary:    #E8E6E1;
  --color-surface:        #FFFFFF;
  --color-bg-rgb:         250,250,249;

  --color-text:           #1C1917;
  --color-text-secondary: #78716C;
  --color-text-tertiary:  #A8A29E;

  --color-primary:        #E8590C;
  --color-primary-soft:   #FFF7ED;
  --color-primary-hover:  #C2410C;
  --color-accent:         #3730A3;
  --color-accent-soft:    #EEF2FF;

  --color-geo-1:          #FED7AA;
  --color-geo-2:          #C7D2FE;
  --color-geo-3:          #E8E6E1;

  --color-border:         #E7E5E4;
  --color-border-strong:  #D6D3D1;

  --shadow-sm:  0 1px 3px rgba(28,25,23,0.04), 0 1px 2px rgba(28,25,23,0.06);
  --shadow-md:  0 4px 12px rgba(28,25,23,0.06), 0 2px 4px rgba(28,25,23,0.04);
  --shadow-lg:  0 12px 32px rgba(28,25,23,0.08), 0 4px 8px rgba(28,25,23,0.04);
  --shadow-glow: 0 0 0 3px rgba(232,89,12,0.12);

  --color-code-bg:      #F5F5F4;
  --color-code-text:    #292524;
  --color-code-border:  #E7E5E4;

  --color-success: #16A34A;
  --color-danger:  #DC2626;
  --color-warning: #D97706;
}

/* --- Dark Mode: "Deep Space & Neon" --- */
:root[data-theme="dark"] {
  --color-bg:             #0C0A09;
  --color-bg-secondary:   #1C1917;
  --color-bg-tertiary:    #292524;
  --color-surface:        #1C1917;
  --color-bg-rgb:         12,10,9;

  --color-text:           #F5F5F4;
  --color-text-secondary: #A8A29E;
  --color-text-tertiary:  #78716C;

  --color-primary:        #FB923C;
  --color-primary-soft:   #431407;
  --color-primary-hover:  #F97316;
  --color-accent:         #818CF8;
  --color-accent-soft:    #1E1B4B;

  --color-geo-1:          #431407;
  --color-geo-2:          #1E1B4B;
  --color-geo-3:          #292524;

  --color-border:         #292524;
  --color-border-strong:  #44403C;

  --shadow-sm:  0 1px 3px rgba(0,0,0,0.3);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg:  0 12px 32px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 0 3px rgba(251,146,60,0.2);

  --color-code-bg:      #1C1917;
  --color-code-text:    #F5F5F4;
  --color-code-border:  #292524;

  --color-success: #22C55E;
  --color-danger:  #EF4444;
  --color-warning: #FBBF24;
}

/* --- Design Tokens --- */
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;

  --max-width-prose:   720px;
  --max-width-content: 1080px;
  --max-width-wide:    1280px;

  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body:    'Libre Baskerville', 'Noto Serif SC', Georgia, serif;
  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:    0.75rem;
  --text-sm:    0.875rem;
  --text-base:  1rem;
  --text-lg:    1.125rem;
  --text-xl:    1.25rem;
  --text-2xl:   1.5rem;
  --text-3xl:   1.875rem;
  --text-4xl:   2.25rem;
  --text-5xl:   3rem;
  --text-6xl:   3.75rem;
}

/* --- Theme Transition --- */
body, .card, .nav-bar, .footer-wrap, .hero-section, .sidebar-block, input, textarea, button {
  transition: background-color 300ms ease, color 200ms ease, border-color 250ms ease, box-shadow 250ms ease;
}
`;
