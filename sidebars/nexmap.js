// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  nexmapSidebar: [
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
        "guides/interface",
        "guides/travel",
        "guides/landmarks",
        "guides/npc-lookups",
        "guides/commands",
        {
          type: "category",
          label: "Configuration",
          link: { type: "doc", id: "guides/configuration/index" },
          items: [
            "guides/configuration/display",
            "guides/configuration/pathing-travel",
            "guides/configuration/city-lockouts",
          ],
        },
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
