// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  nexbashSidebar: [
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
        "guides/commands",
        {
          type: "category",
          label: "Configuration",
          link: { type: "doc", id: "guides/configuration/index" },
          items: [
            "guides/configuration/options",
            "guides/configuration/class-configuration",
            "guides/configuration/target-priorities",
          ],
        },
        "guides/decision-model",
        "guides/strategies",
        "guides/profiles",
        "guides/battlerage",
        "guides/areas",
        "guides/session-and-automations",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: { type: "doc", id: "reference/index" },
      items: [
        "reference/state",
        "reference/api",
        "reference/options",
        "reference/events",
      ],
    },
    "troubleshooting",
  ],
};

export default sidebars;
