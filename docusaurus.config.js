// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "neX-Files",
  tagline: "The documentation is out there",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://nexusunleashed.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/nex-files/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "NexusUnleashed", // Usually your GitHub org/user name.
  projectName: "nex-files", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/NexusUnleashed/nex-files/tree/main/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/NexusUnleashed/nex-files/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/GeminiLogo.jpg",
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Home",
        logo: {
          alt: "My Site Logo",
          src: "img/GeminiLogo.jpg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "eventStreamSidebar",
            position: "left",
            label: "eventStream",
          },
          {
            type: "docSidebar",
            sidebarId: "nexSysSidebar",
            position: "left",
            label: "nexSys",
          },
          {
            type: "docSidebar",
            sidebarId: "nexMapSidebar",
            position: "left",
            label: "nexMap",
          },
          {
            type: "docSidebar",
            sidebarId: "nexGuiSidebar",
            position: "left",
            label: "nexGui",
          },
          {
            type: "docSidebar",
            sidebarId: "nexActionSidebar",
            position: "left",
            label: "nexAction",
          },
          {
            type: "docSidebar",
            sidebarId: "insightSidebar",
            position: "left",
            label: "insight",
          },
          {
            type: "docSidebar",
            sidebarId: "nexusSidebar",
            position: "left",
            label: "Nexus",
          },
          { to: "/blog", label: "Blog", position: "right" },
          {
            href: "https://github.com/NexusUnleashed/nex-files",
            label: "GitHub",
            position: "right",
          },
          /*
          {
            type: "dropdown",
            label: "Community",
            position: "left",
            items: [
              {
                label: "Facebook",
                href: "https://www.facebook.com",
              },
              {
                type: "doc",
                label: "Social",
                docId: "nexSys/introduction",
              },
              // ... more items
            ],
          },
          */
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Links",
            items: [
              {
                label: "Achaea",
                href: "https://www.achaea.com/front",
              },
              {
                label: "Nexus Wiki",
                href: "https://nexus.ironrealms.com/Main_Page",
              },
              {
                label: "GitHub",
                href: "https://github.com/log-wall/nex-files",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Achaea Discord",
                href: "https://discord.gg/achaea",
              },
              {
                label: "Nexus Discord",
                href: "https://discord.gg/M5spRjAw",
              },
            ],
          },
          {
            title: "Authors",
            items: [{ label: "Khaseem (Achaea)", to: "/" }],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nexus Unleashed, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  themes: ["@docusaurus/theme-mermaid"],
  // In order for Mermaid code blocks in Markdown to work,
  // you also need to enable the Remark plugin with this option
  markdown: {
    mermaid: true,
  },
};

export default config;
