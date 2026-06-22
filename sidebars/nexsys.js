// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  nexsysSidebar: [
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
        {
          type: "category",
          label: "Configuration",
          link: { type: "doc", id: "guides/configuration/index" },
          items: [
            "guides/configuration/system",
            "guides/configuration/affliction-priorities",
            "guides/configuration/defences",
            "guides/configuration/precache",
            "guides/configuration/colors",
          ],
        },
        "guides/curing",
        "guides/queues",
        "guides/custom-prompt",
        "guides/rules",
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
        "reference/generated/nexsys4-event-dictionary",
        "reference/generated/nexsys4-eventstream-reference",
      ],
    },
    "troubleshooting",
  ],
};

export default sidebars;
