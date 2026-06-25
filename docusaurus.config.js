// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import { themes as prismThemes } from "prism-react-renderer";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const repositoriesRoot = process.env.NEX_REPOS_ROOT ?? path.resolve(siteDir, "..");

const packageDocsPath = (repository) =>
  path.join(repositoriesRoot, repository, "docs", "docusaurus-content");

const visitLinks = (node, visitor) => {
  if (!node || typeof node !== "object") return;
  if (node.type === "link") visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visitLinks(child, visitor);
  }
};

const rewriteMarkdownLinks = (rewrites) => () => (tree) => {
  visitLinks(tree, (node) => {
    if (Object.hasOwn(rewrites, node.url)) {
      node.url = rewrites[node.url];
    }
  });
};

const packageDocsPlugin = ({
  id,
  repository,
  route,
  sidebar,
  editBranch = "main",
  markdownLinkRewrites,
}) => [
  "@docusaurus/plugin-content-docs",
  {
    id,
    path: packageDocsPath(repository),
    routeBasePath: `docs/${route}`,
    sidebarPath: `./sidebars/${sidebar}.js`,
    exclude: ["README.md", "**/README.md"],
    editUrl: `https://github.com/NexusUnleashed/${repository}/edit/${editBranch}/docs/docusaurus-content/`,
    beforeDefaultRemarkPlugins: markdownLinkRewrites
      ? [rewriteMarkdownLinks(markdownLinkRewrites)]
      : [],
  },
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "nex*",
  tagline: "A modern package ecosystem for Achaea on Nexus",
  favicon: "img/favicon.ico",
  url: "https://nexusunleashed.github.io",
  baseUrl: "/nex-files/",
  organizationName: "NexusUnleashed",
  projectName: "nex-files",
  onBrokenLinks: "throw",
  trailingSlash: true,

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
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/NexusUnleashed/nex-files/edit/main/",
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      }),
    ],
  ],

  plugins: [
    packageDocsPlugin({
      id: "nexsys",
      repository: "nexsys4",
      route: "nexsys",
      sidebar: "nexsys",
    }),
    packageDocsPlugin({
      id: "nexmap",
      repository: "nexmap4",
      route: "nexmap",
      sidebar: "nexmap",
    }),
    packageDocsPlugin({
      id: "nexgui",
      repository: "nexgui4",
      route: "nexgui",
      sidebar: "nexgui",
    }),
    packageDocsPlugin({
      id: "nexbash",
      repository: "nexbash3",
      route: "nexbash",
      sidebar: "nexbash",
      editBranch: "nexBash4",
      markdownLinkRewrites: {
        "../nexSys/introduction.md": "/docs/nexsys/introduction",
        "../../nexSys/getting-started/installation.md":
          "/docs/nexsys/getting-started/installation",
      },
    }),
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "compendium",
        path: "compendium",
        routeBasePath: "compendium",
        sidebarPath: "./sidebars/compendium.js",
        editUrl: "https://github.com/NexusUnleashed/nex-files/edit/main/compendium/",
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          { from: "/docs/classleads/class-skills-tree", to: "/compendium/classleads" },
          { from: "/docs/bazaar/inventory", to: "/compendium/bazaar" },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/GeminiLogo.jpg",
      metadata: [
        { name: "theme-color", content: "#0b0f17" },
        {
          name: "keywords",
          content:
            "Achaea, Nexus, nexSys, nexMap, nexGui, nexBash, JavaScript packages",
        },
      ],
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "nex*",
        hideOnScroll: true,
        logo: {
          alt: "nex star mark",
          src: "img/nex-mark.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            position: "left",
            label: "Docs",
          },
          {
            type: "dropdown",
            label: "Packages",
            position: "left",
            items: [
              { label: "All packages", to: "/docs/packages" },
              { label: "nexSys4", to: "/docs/nexsys/introduction" },
              { label: "nexMap4", to: "/docs/nexmap/introduction" },
              { label: "nexGui4", to: "/docs/nexgui/introduction" },
              { label: "nexBash4", to: "/docs/nexbash/introduction" },
              { label: "insight", to: "/docs/insight/introduction" },
              { label: "eventStream", to: "/docs/eventStream/introduction" },
              { label: "nexAction", to: "/docs/nexAction/introduction" },
            ],
          },
          {
            type: "dropdown",
            label: "Compendium",
            position: "left",
            items: [
              { label: "Compendium home", to: "/compendium" },
              { label: "Classleads", to: "/compendium/classleads" },
              { label: "Year 1000 Bazaar", to: "/compendium/bazaar" },
            ],
          },
          {
            type: "dropdown",
            label: "Labs",
            position: "left",
            className: "navbar-labs-link",
            items: [
              { label: "Labs overview", to: "/docs/labs" },
              { label: "nexGear · alpha", to: "/docs/labs/nexgear" },
              { label: "nexWorld · early", to: "/docs/labs/nexworld" },
            ],
          },
          {
            href: "https://github.com/NexusUnleashed",
            label: "GitHub",
            position: "right",
            "aria-label": "Nexus Unleashed on GitHub",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Explore",
            items: [
              { label: "Documentation", to: "/docs" },
              { label: "Packages", to: "/docs/packages" },
              { label: "Compendium", to: "/compendium" },
              { label: "Labs", to: "/docs/labs" },
            ],
          },
          {
            title: "Packages",
            items: [
              { label: "nexSys4", to: "/docs/nexsys/introduction" },
              { label: "nexMap4", to: "/docs/nexmap/introduction" },
              { label: "nexGui4", to: "/docs/nexgui/introduction" },
              { label: "nexBash4", to: "/docs/nexbash/introduction" },
              { label: "insight", to: "/docs/insight/introduction" },
            ],
          },
          {
            title: "Community",
            items: [
              { label: "Nexus Unleashed", href: "https://github.com/NexusUnleashed" },
              { label: "Achaea", href: "https://www.achaea.com/" },
              { label: "Nexus Wiki", href: "https://nexus.ironrealms.com/Main_Page" },
            ],
          },
        ],
        copyright: `Built for Achaea's Nexus client · ${new Date().getFullYear()} Nexus Unleashed`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash", "json"],
      },
    }),

  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "throw",
      onBrokenMarkdownImages: "warn",
    },
  },
};

export default config;
