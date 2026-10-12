/* Inline SVG brand icons for the social dock. Keys must match the
   "icon" values used in site.config.json. */
const SOCIAL_ICONS = {
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 5.8a5.1 5.1 0 0 1-3.5-4.6H12.6v13.9a2.9 2.9 0 1 1-2-2.7V7.9a6.4 6.4 0 1 0 5.5 6.3V8.9a8.6 8.6 0 0 0 3.5.7V5.8z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.2L24 22.8h-7.5l-5.9-7.6-6.7 7.6H.2l8.6-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.4h2L6.6 3.3H4.4l13.2 17.3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
  rumble: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.2 14.6-4-2.3v-4.6l4 2.3v4.6zm2.4 0v-4.6l4-2.3v4.6l-4 2.3zM12 8.1 8 10.4l4 2.3 4-2.3-4-2.3z"/></svg>'
};

/* Shown until assets/portrait.jpg exists. */
function portraitPlaceholderSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#dfe8d8"/>
    <circle cx="100" cy="78" r="38" fill="#9db08c"/>
    <path d="M40 180c8-38 32-58 60-58s52 20 60 58z" fill="#9db08c"/>
    <text x="100" y="196" text-anchor="middle" font-size="11" fill="#5c6e52" font-family="sans-serif">portrait.jpg goes here</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
