// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  nexguiSidebar: [
    "introduction",
    {
      type: "category",
      label: "Get started",
      items: ["getting-started/installation", "getting-started/quickstart"],
    },
    {
      type: "category",
      label: "Guides",
      link: { type: "doc", id: "guides/index" },
      items: [
        "guides/panels",
        "guides/options",
        "guides/main-display",
        "guides/streams",
        "guides/layout",
        "guides/features",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: { type: "doc", id: "reference/index" },
      items: [
        "reference/state",
        "reference/api",
        "reference/events",
      ],
    },
    "troubleshooting",
  ],
};

export default sidebars;
