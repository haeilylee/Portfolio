import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import rehypeRaw from 'rehype-raw';

const sharedSidebar = [
  { text: 'Home', link: '/' },
  {
    text: 'Categories',
    collapsed: false,
    items: [
      { text: 'Design System', link: '/projects/sdui' },
      { text: 'AI', link: '/projects/ai-requirements' },
      { text: 'UX Research', link: '/projects/data-ux' },
    ],
  },
  { text: 'About', link: '/about' },
];

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Hakyeong Lee',
  description: 'Product Designer & Developer',
  icon: '/profile.webp',
  logo: {
    light: '/profile.webp',
    dark: '/profile.webp',
  },
  lang: 'ko',
  globalStyles: path.join(__dirname, './styles/index.css'),
  themeConfig: {
    darkMode: false,
    nav: [
      { text: 'Projects', link: '/projects/' },
      { text: 'About', link: '/about' },
    ],
    sidebar: {
      '/': sharedSidebar,
      '/projects': sharedSidebar,
      '/about': sharedSidebar,
    },
    footer: {
      message: '© 2025 Hakyeong Lee',
    },
  },
  markdown: {
    mdxRs: false,
    checkDeadLinks: false,
    rehypePlugins: [[rehypeRaw]],
  },
});
