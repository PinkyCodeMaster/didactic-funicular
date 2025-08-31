// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Oakford Documentation',
            description: 'Complete documentation for the Oakford platform - web, mobile, and admin applications with authentication and modern architecture',
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/your-org/oakford' },
                { icon: 'discord', label: 'Discord', href: 'https://discord.gg/oakford' },
            ],
            editLink: {
                baseUrl: 'https://github.com/your-org/oakford/edit/main/apps/docs/',
            },
            lastUpdated: true,
            pagination: true,
            favicon: '/favicon.svg',
            customCss: [
                './src/styles/custom.css',
            ],
            expressiveCode: {
                themes: ['github-dark', 'github-light'],
                styleOverrides: { 
                    borderRadius: '0.5rem',
                },
            },
            sidebar: [
                {
                    label: 'Getting Started',
                    badge: { text: 'Start Here', variant: 'tip' },
                    items: [
                        { label: 'Introduction', slug: 'getting-started/introduction' },
                        { label: 'Quick Start', slug: 'getting-started/quick-start' },
                        { label: 'Architecture', slug: 'getting-started/architecture' },
                    ],
                },
                {
                    label: 'User Guide',
                    badge: { text: 'For Users', variant: 'success' },
                    items: [
                        { label: 'Web Application', slug: 'user-guide/web-app' },
                        { label: 'Mobile Application', slug: 'user-guide/mobile-app' },
                    ],
                },
                {
                    label: 'Admin Guide',
                    badge: { text: 'Admin Only', variant: 'caution' },
                    items: [
                        { label: 'Admin Panel', slug: 'admin-guide/admin-panel' },
                    ],
                },
                {
                    label: 'Technical Reference',
                    badge: { text: 'Developers', variant: 'note' },
                    items: [
                        { label: 'API Reference', slug: 'technical/api-reference' },
                        { label: 'Development Guide', slug: 'technical/development' },
                    ],
                },
                {
                    label: 'Internal Documentation',
                    collapsed: true,
                    badge: { text: 'Legacy', variant: 'default' },
                    items: [
                        { label: 'Development Setup', slug: 'internal/development-setup' },
                    ],
                },
            ],
            head: [
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:image',
                        content: 'https://oakford.dev/og-image.png',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'twitter:image',
                        content: 'https://oakford.dev/og-image.png',
                    },
                },
            ],
        }),
        sitemap()
    ],
});