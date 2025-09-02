// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Oakford Technology Documentation',
            description: 'Comprehensive documentation for Oakford Technology services - AISP, Recycling, School Networks, IT Support, Data Centre operations and more',
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/PinkyCodeMaster/didactic-funicular' },
            ],
            editLink: {
                baseUrl: 'https://github.com/PinkyCodeMaster/didactic-funicular/edit/main/apps/docs/',
            },
            lastUpdated: true,
            pagination: true,
            favicon: '/favicon.svg',
            sidebar: [
                {
                    label: 'Getting Started',
                    badge: { text: 'Start Here', variant: 'tip' },
                    items: [
                        { label: 'Welcome to Oakford Technology', slug: 'getting-started/introduction' },
                        { label: 'Company Overview', slug: 'getting-started/company-overview' },
                        { label: 'Service Architecture', slug: 'getting-started/architecture' },
                        { label: 'Quick Navigation Guide', slug: 'getting-started/navigation' },
                    ],
                },
                {
                    label: 'AISP Services',
                    badge: { text: 'Financial', variant: 'success' },
                    items: [
                        { label: 'AISP Overview', slug: 'aisp/overview' },
                        { label: 'Account Information Services', slug: 'aisp/account-services' },
                        { label: 'API Integration', slug: 'aisp/api-integration' },
                        { label: 'Compliance & Security', slug: 'aisp/compliance' },
                    ],
                },
                {
                    label: 'Recycling Services',
                    badge: { text: 'Environmental', variant: 'note' },
                    items: [
                        { label: 'Recycling Overview', slug: 'recycling/overview' },
                        { label: 'Collection Services', slug: 'recycling/collection' },
                        { label: 'Processing & Sorting', slug: 'recycling/processing' },
                        { label: 'Reporting & Analytics', slug: 'recycling/reporting' },
                    ],
                },
                {
                    label: 'School Network Services',
                    badge: { text: 'Education', variant: 'caution' },
                    items: [
                        { label: 'Network Overview', slug: 'school-networks/overview' },
                        { label: 'Infrastructure Management', slug: 'school-networks/infrastructure' },
                        { label: 'Security & Filtering', slug: 'school-networks/security' },
                        { label: 'Support & Maintenance', slug: 'school-networks/support' },
                    ],
                },
                {
                    label: 'IT Support Services',
                    badge: { text: 'Support', variant: 'default' },
                    items: [
                        { label: 'Support Overview', slug: 'it-support/overview' },
                        { label: 'Help Desk Services', slug: 'it-support/helpdesk' },
                        { label: 'Remote Support', slug: 'it-support/remote-support' },
                        { label: 'On-Site Services', slug: 'it-support/onsite' },
                        { label: 'Maintenance Contracts', slug: 'it-support/maintenance' },
                    ],
                },
                {
                    label: 'Data Centre Operations',
                    badge: { text: 'Infrastructure', variant: 'danger' },
                    items: [
                        { label: 'Data Centre Overview', slug: 'data-centre/overview' },
                        { label: 'Hosting Services', slug: 'data-centre/hosting' },
                        { label: 'Colocation Services', slug: 'data-centre/colocation' },
                        { label: 'Backup & Recovery', slug: 'data-centre/backup' },
                        { label: 'Monitoring & Alerts', slug: 'data-centre/monitoring' },
                    ],
                },
                {
                    label: 'Platform Applications',
                    badge: { text: 'Apps', variant: 'tip' },
                    items: [
                        { label: 'Web Application', slug: 'applications/web-app' },
                        { label: 'Mobile Application', slug: 'applications/mobile-app' },
                        { label: 'Admin Panel', slug: 'applications/admin-panel' },
                        { label: 'Backend Services', slug: 'applications/backend' },
                    ],
                },
                {
                    label: 'Technical Documentation',
                    collapsed: true,
                    badge: { text: 'Developers', variant: 'note' },
                    items: [
                        { label: 'API Reference', slug: 'technical/api-reference' },
                        { label: 'Authentication', slug: 'technical/authentication' },
                        { label: 'Development Setup', slug: 'technical/development' },
                        { label: 'Deployment Guide', slug: 'technical/deployment' },
                        { label: 'Database Schema', slug: 'technical/database' },
                    ],
                },
                {
                    label: 'Internal Resources',
                    collapsed: true,
                    badge: { text: 'Internal', variant: 'default' },
                    items: [
                        { label: 'Staff Directory', slug: 'internal/staff-directory' },
                        { label: 'Policies & Procedures', slug: 'internal/policies' },
                        { label: 'Emergency Contacts', slug: 'internal/emergency' },
                        { label: 'Training Materials', slug: 'internal/training' },
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