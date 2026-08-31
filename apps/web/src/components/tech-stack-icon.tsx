import * as React from "react";
import type { TechStack } from "@growthcoder/types";

// High-quality SVG icons for popular developer tools and stacks
export const TECH_ICONS: Record<string, string> = {
  tailwind: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#06B6D4"/></svg>`,
  tailwindcss: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#06B6D4"/></svg>`,
  vue: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 3.5h4.2l6.3 11 6.3-11h4.2L12 21.5 1.5 3.5z" fill="#41B883"/><path d="M6.5 3.5h4.2L12 5.8l1.3-2.3h4.2L12 13.5 6.5 3.5z" fill="#35495E"/></svg>`,
  vuejs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 3.5h4.2l6.3 11 6.3-11h4.2L12 21.5 1.5 3.5z" fill="#41B883"/><path d="M6.5 3.5h4.2L12 5.8l1.3-2.3h4.2L12 13.5 6.5 3.5z" fill="#35495E"/></svg>`,
  laravel: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M19.8 4.2 13.5.6a2.6 2.6 0 0 0-2.6 0L4.6 4.2A2.6 2.6 0 0 0 3.3 6.5v8.7a2.6 2.6 0 0 0 1.3 2.3l6.3 3.6a2.6 2.6 0 0 0 2.6 0l6.3-3.6a2.6 2.6 0 0 0 1.3-2.3V6.5a2.6 2.6 0 0 0-1.3-2.3zm-7.6 16.3-6.3-3.6V8.2l6.3 3.6v8.7zm1.3 0V11.8l2.5-1.4v6.4l-2.5 1.4v2.3zm0-10.5L7.2 6.4 12.2 3.5l5 2.9-3.7 2.1z" fill="#FF2D20"/></svg>`,
  mysql: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M16.5 4.5c-2.3 0-4.2 1.3-5.2 3.2-1-.7-2.3-1.2-3.8-1.2-3.3 0-6 2.7-6 6s2.7 6 6 6c1.6 0 3.1-.6 4.2-1.7.9 1.1 2.3 1.7 3.8 1.7 2.8 0 5-2.2 5-5s-1.8-9-4-9zm-9 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm9 0c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#00758F"/></svg>`,
  react: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>`,
  nextjs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><circle cx="12" cy="12" r="11" fill="#000000"/><path d="M16.8 17.5 9.2 7.7H7.5v8.6h1.7v-6.3l6.5 8.4c.4-.3.8-.6 1.1-.9zM15 7.7h1.7v5.2L15 10.7V7.7z" fill="#ffffff"/></svg>`,
  typescript: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M5.5 10.5h6.5v2h-2.2v6.5h-2.1v-6.5h-2.2v-2zm7.7 5.2c.4.8 1.1 1.4 2.2 1.4 1.1 0 1.8-.5 1.8-1.3 0-.8-.6-1.1-1.7-1.5l-.8-.3c-1.6-.6-2.5-1.5-2.5-2.8 0-1.8 1.4-3 3.4-3 1.5 0 2.6.6 3.3 1.8l-1.6 1c-.4-.7-.9-1-1.7-1-.8 0-1.4.5-1.4 1.1 0 .6.4.9 1.4 1.3l.8.3c1.9.7 2.8 1.6 2.8 3 0 1.9-1.5 3.1-3.7 3.1-2 0-3.3-.9-4-2.2l1.6-1.2z" fill="#ffffff"/></svg>`,
  javascript: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 17.5c.8.5 1.8.8 2.8.8 2 0 3.2-1 3.2-3v-6.8h-2v6.8c0 .8-.4 1.2-1.2 1.2-.6 0-1.2-.2-1.6-.5l-1.2 1.5zm8.5-.2c.9.6 2 1 3.2 1 2.2 0 3.6-1.1 3.6-2.8 0-1.7-1-2.4-2.7-3.1l-.8-.3c-1.1-.4-1.6-.8-1.6-1.4 0-.6.5-1.1 1.4-1.1.8 0 1.6.3 2.2.8l1-1.5c-.8-.7-1.9-1.1-3.2-1.1-2.2 0-3.4 1.2-3.4 2.7 0 1.6 1 2.4 2.6 3l.8.3c1.2.5 1.7.9 1.7 1.5 0 .7-.6 1.2-1.6 1.2-1 0-2-.4-2.8-1l-1.1 1.6z" fill="#000000"/></svg>`,
  postgresql: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13.5h-2v3.5H7.5v2H11v4h2v-4h3.5v-2H13V6.5z" fill="#336791"/></svg>`,
  docker: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M13.9 6.2h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm5.4 2.7h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm-2.7 0h2.2v2.2H5.8zm15.4 2.5c-.4-.3-1.4-.4-2.1 0-.3.2-.6.4-.8.7-.3-.1-.6-.1-.9-.1-1.6 0-2.8 1.1-3 2.6H2.1c-.3 1.5.3 3.1 1.5 4.1 2 1.6 4.7 2.1 7.2 1.4 3.7-1 6.5-4 7.2-7.8.8.1 1.7-.1 2.2-.6.4-.4.8-1.2.6-1.8-.1-.4-.3-.6-.6-.7z" fill="#2496ED"/></svg>`,
  adonisjs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2.5 3 19.5h18L12 2.5zm0 4.8 5.5 10.2h-11L12 7.3z" fill="#5A45FF"/></svg>`,
  nodejs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2 2 7.7v11.5l10 5.8 10-5.8V7.7L12 2zm7.9 16-7.9 4.6-7.9-4.6V8.9l7.9-4.6 7.9 4.6v9.1z" fill="#68A063"/></svg>`,
  git: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M22.5 10.8 13.2 1.5a1.8 1.8 0 0 0-2.5 0L8.4 3.8l3.2 3.2a2.1 2.1 0 0 1 2.7 2.7l3.1 3.1a2.1 2.1 0 1 1-1.3 1.2l-2.9-2.9v4.2a2.1 2.1 0 1 1-1.8 0V11a2.1 2.1 0 0 1-1.1-2.7L7.1 5.1 1.5 10.8a1.8 1.8 0 0 0 0 2.5l9.3 9.3c.7.7 1.8.7 2.5 0l9.2-9.3a1.8 1.8 0 0 0 0-2.5z" fill="#F05032"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-foreground"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  gitgithub: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M22.5 10.8 13.2 1.5a1.8 1.8 0 0 0-2.5 0L8.4 3.8l3.2 3.2a2.1 2.1 0 0 1 2.7 2.7l3.1 3.1a2.1 2.1 0 1 1-1.3 1.2l-2.9-2.9v4.2a2.1 2.1 0 1 1-1.8 0V11a2.1 2.1 0 0 1-1.1-2.7L7.1 5.1 1.5 10.8a1.8 1.8 0 0 0 0 2.5l9.3 9.3c.7.7 1.8.7 2.5 0l9.2-9.3a1.8 1.8 0 0 0 0-2.5z" fill="#F05032"/></svg>`,
  redis: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M21.5 8.5 12 3.8 2.5 8.5v7l9.5 4.7 9.5-4.7v-7z" fill="#DC382D"/><path d="M12 5.5l7 3.5-7 3.5-7-3.5 7-3.5zm-6.5 5.2L11 13v5.5l-5.5-2.7v-5.1zm13 0v5.1L13 18.5V13l5.5-2.3z" fill="#A3241A"/></svg>`,
  figma: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/><path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/><path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E"/><path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262"/><path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE"/></svg>`,
  postman: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><circle cx="12" cy="12" r="10.5" fill="#FF6C37"/><path d="M14.5 7.5 9 10.8l2.2 1.3 5.5-3.3-2.2-1.3zm-5.8 4.2v3.8l2.2-1.3v-3.8l-2.2 1.3zm3.2 2.2v3.1l4.8-2.9-2.6-1.5-2.2 1.3z" fill="#ffffff"/></svg>`,
  linux: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><ellipse cx="12" cy="13" rx="7" ry="8" fill="#FFD13B"/><ellipse cx="12" cy="13" rx="5.5" ry="6.5" fill="#000000"/><ellipse cx="12" cy="14" rx="4" ry="5" fill="#FFFFFF"/><circle cx="10" cy="9" r="1" fill="#000000"/><circle cx="14" cy="9" r="1" fill="#000000"/><path d="M11 11h2l-1 2-1-2z" fill="#FFA500"/><ellipse cx="8" cy="20" rx="3" ry="1.5" fill="#FFA500"/><ellipse cx="16" cy="20" rx="3" ry="1.5" fill="#FFA500"/></svg>`,
  nginx: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2.2 21.5 7.7v11.1L12 24.3 2.5 18.8V7.7L12 2.2z" fill="#009639"/><path d="M8 8v8l8-8v8" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  nestjs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M21.8 7.3c-.3-.8-.8-1.5-1.5-2.1l-6.8-5a2.5 2.5 0 0 0-2.9 0L3.8 5.2c-.7.6-1.2 1.3-1.5 2.1-.4 1.1-.3 2.3.2 3.3L8 22.2a2.3 2.3 0 0 0 3.7.3l2.8-3.4 4.5-5.5c.8-1 1.1-2.2.8-3.4l2-2.9z" fill="#E0234E"/><path d="M12.5 16.5 7.2 9.8c-.4-.5-.3-1.3.2-1.7s1.3-.3 1.7.2l4.8 6 4.3-5.3c.4-.5 1.2-.6 1.7-.2s.6 1.2.2 1.7l-5.6 6.9a1.5 1.5 0 0 1-1.9.1z" fill="#FFFFFF"/></svg>`,
  sqlite: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 3c-5.5 0-9 1.3-9 3v12c0 1.7 3.5 3 9 3s9-1.3 9-3V6c0-1.7-3.5-3-9-3z" fill="#003B57"/><ellipse cx="12" cy="6" rx="7.5" ry="2" fill="#00A2D9"/><path d="M4.5 10c1.5 1.2 4.3 1.8 7.5 1.8s6-.6 7.5-1.8M4.5 14.5c1.5 1.2 4.3 1.8 7.5 1.8s6-.6 7.5-1.8" stroke="#00A2D9" stroke-width="1.5"/></svg>`,
  go: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 12.5c0-1.8 1.2-3.3 3-3.7.3-.1.6-.1.9-.1h1.1v1.6H5.4c-1 0-1.9.7-2.1 1.7-.3 1.2.6 2.3 1.8 2.3h2.4v1.6H5.1c-2-.1-3.6-1.6-3.6-3.4zm8.6-3.8h2.3c2.4 0 4.1 1.6 4.1 3.8 0 2.3-1.8 3.9-4.2 3.9H9.4v-9.5h1.7v1.8h-1zm1.7 6.1c1.3 0 2.3-.9 2.3-2.3 0-1.3-1-2.2-2.3-2.2h-.7v4.5h.7zm6.7-2.3c0-2.3 1.8-3.9 4.1-3.9 2.4 0 4.1 1.6 4.1 3.9s-1.8 3.9-4.1 3.9c-2.3 0-4.1-1.6-4.1-3.9zm6.4 0c0-1.4-1-2.3-2.3-2.3s-2.3.9-2.3 2.3 1 2.3 2.3 2.3 2.3-.9 2.3-2.3z" fill="#00ADD8"/></svg>`,
  golang: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 12.5c0-1.8 1.2-3.3 3-3.7.3-.1.6-.1.9-.1h1.1v1.6H5.4c-1 0-1.9.7-2.1 1.7-.3 1.2.6 2.3 1.8 2.3h2.4v1.6H5.1c-2-.1-3.6-1.6-3.6-3.4zm8.6-3.8h2.3c2.4 0 4.1 1.6 4.1 3.8 0 2.3-1.8 3.9-4.2 3.9H9.4v-9.5h1.7v1.8h-1zm1.7 6.1c1.3 0 2.3-.9 2.3-2.3 0-1.3-1-2.2-2.3-2.2h-.7v4.5h.7zm6.7-2.3c0-2.3 1.8-3.9 4.1-3.9 2.4 0 4.1 1.6 4.1 3.9s-1.8 3.9-4.1 3.9c-2.3 0-4.1-1.6-4.1-3.9zm6.4 0c0-1.4-1-2.3-2.3-2.3s-2.3.9-2.3 2.3 1 2.3 2.3 2.3 2.3-.9 2.3-2.3z" fill="#00ADD8"/></svg>`,
  cicd: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><circle cx="6" cy="12" r="3" fill="#2088FF"/><circle cx="18" cy="6" r="3" fill="#2088FF"/><circle cx="18" cy="18" r="3" fill="#2088FF"/><path d="M9 12h3m3-6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3" stroke="#2088FF" stroke-width="2" stroke-linecap="round"/></svg>`,
  cicdpipelines: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><circle cx="6" cy="12" r="3" fill="#2088FF"/><circle cx="18" cy="6" r="3" fill="#2088FF"/><circle cx="18" cy="18" r="3" fill="#2088FF"/><path d="M9 12h3m3-6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3" stroke="#2088FF" stroke-width="2" stroke-linecap="round"/></svg>`,
  python: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M11.9 2c-3.1 0-4.9.4-4.9 2.3v2.8h5v.8H5c-2.2 0-3 .9-3 3.6 0 2.5.7 3.6 3 3.6h1.7v-2.3c0-1.8 1.4-3.3 3.3-3.3h5V7.1c0-2.8-2-5.1-5.1-5.1zm-1.8 1.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill="#3776AB"/><path d="M12.1 22c3.1 0 4.9-.4 4.9-2.3v-2.8h-5v-.8H19c2.2 0 3-.9 3-3.6 0-2.5-.7-3.6-3-3.6h-1.7v2.3c0 1.8-1.4 3.3-3.3 3.3h-5v2.4c0 2.8 2 5.1 5.1 5.1zm1.8-1.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z" fill="#FFD43B"/></svg>`,
  mongodb: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 1.5s-6.5 4.9-6.5 12.1c0 5 3.6 8.3 6.5 9.4 2.9-1.1 6.5-4.4 6.5-9.4C18.5 6.4 12 1.5 12 1.5zm0 18.5c-.2 0-.3 0-.5-.1V4.2c.2.2.3.4.5.6v15.2z" fill="#47A248"/></svg>`,
};

/**
 * Returns raw SVG string for a TechStack item (custom DB SVG or mapped SVG), or null if none available.
 */
export function getTechIconSvg(tech: { iconSvg?: string | null; slug?: string; name?: string }): string | null {
  if (tech.iconSvg && tech.iconSvg.trim().startsWith("<svg")) {
    return tech.iconSvg;
  }

  const cleanKey = (tech.slug || tech.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return (
    TECH_ICONS[cleanKey] ||
    Object.entries(TECH_ICONS).find(([key]) => cleanKey.includes(key))?.[1] ||
    null
  );
}

interface TechStackIconProps {
  tech: TechStack;
  className?: string;
}

export function TechStackIcon({
  tech,
  className = "w-4 h-4 shrink-0",
}: TechStackIconProps) {
  const matchedIcon = getTechIconSvg(tech);

  if (matchedIcon) {
    return (
      <span
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: matchedIcon }}
      />
    );
  }

  // Fallback: stylized colored dot
  return (
    <span className="h-2 w-2 rounded-full bg-primary/80 ring-2 ring-primary/20 shrink-0" />
  );
}

