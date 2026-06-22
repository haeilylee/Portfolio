import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import rehypeRaw from 'rehype-raw';

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
      {
        text: 'About',
        link: '/about',
        position: 'left',
      },
      {
        text: 'Projects',
        link: '/projects/',
        position: 'left',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'About Me',
          link: '/about',
        },
        {
          text: 'Projects',
          items: [
            {
              text: '전체 보기',
              link: '/projects/',
            },
          ],
        },
      ],
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
