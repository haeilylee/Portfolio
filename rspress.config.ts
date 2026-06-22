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
    nav: [],
    sidebar: {
      '/projects': [
        {
          text: 'Projects',
          items: [
            { text: '전체 보기', link: '/projects/' },
            { text: 'SDUI 컴포넌트 문서화', link: '/projects/sdui' },
            { text: '요구사항 자동화 생성', link: '/projects/ai-requirements' },
            { text: '데이터 통화 UX 개선', link: '/projects/data-ux' },
            { text: '청구 수납 리디자인', link: '/projects/billing' },
            { text: '슈퍼앱 온보딩 개선', link: '/projects/onboarding' },
          ],
        },
        { text: 'About Me', link: '/about' },
      ],
      '/about': [
        {
          text: 'Projects',
          items: [{ text: '전체 보기', link: '/projects/' }],
        },
        { text: 'About Me', link: '/about' },
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
