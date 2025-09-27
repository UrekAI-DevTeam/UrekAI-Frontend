// Centralized route constants for the App Router

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  docs: '/docs',
  pricing: '/pricing',
  auth: {
    shopify: '/auth/shopify',
  },
  shopify: {
    dashboard: '/shopify/dashboard',
  },
  marketing: {
    solutions: '/solutions',
    about: '/about',
    help: '/help',
  },
  legacy: {
    // Pages-router legacy entries if still referenced
    chat: '/ChatInterface',
    settings: '/SettingsPage',
    folders: '/FoldersPage',
    profile: '/ProfilePage',
    insights: '/InsightsPage',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;

