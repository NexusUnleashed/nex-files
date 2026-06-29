import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import {
  LuArrowRight,
  LuBookOpen,
  LuBoxes,
  LuBraces,
  LuBrainCircuit,
  LuFlaskConical,
  LuGithub,
  LuLibraryBig,
  LuMap,
  LuPanelsTopLeft,
  LuRadioTower,
  LuShieldCheck,
  LuSparkles,
  LuSwords,
} from "react-icons/lu";

import styles from "./index.module.css";

const primaryPackages = [
  {
    name: "nexSys4",
    eyebrow: "Character runtime",
    description:
      "Authoritative character state, curing, defences, priorities, queues, and precache.",
    href: "/docs/nexsys/introduction",
    icon: LuShieldCheck,
    accent: "brass",
    status: "Complete reference",
  },
  {
    name: "nexMap4",
    eyebrow: "World navigation",
    description:
      "A clean-room mapping and pathing runtime built from source-owned map data.",
    href: "/docs/nexmap/introduction",
    icon: LuMap,
    accent: "cyan",
    status: "Reference in progress",
  },
  {
    name: "nexGui4",
    eyebrow: "Interface layer",
    description:
      "Composable panels, streams, state views, and gameplay surfaces for the ecosystem.",
    href: "/docs/nexgui/introduction",
    icon: LuPanelsTopLeft,
    accent: "violet",
    status: "Reference in progress",
  },
  {
    name: "nexBash4",
    eyebrow: "Hunting engine",
    description:
      "Decision support for hunting routines, target selection, and battlerage actions.",
    href: "/docs/nexbash/introduction",
    icon: LuSwords,
    accent: "orange",
    status: "Complete reference",
  },
];

const supportingPackages = [
  {
    name: "insight",
    role: "Combat intelligence",
    href: "/docs/insight/introduction",
    icon: LuBrainCircuit,
  },
  {
    name: "eventStream",
    role: "Shared event layer",
    href: "/docs/eventStream/introduction",
    icon: LuRadioTower,
  },
  {
    name: "nexAction",
    role: "Triggers and aliases",
    href: "/docs/nexAction/introduction",
    icon: LuBraces,
  },
];

function PackageCard({ product }) {
  const Icon = product.icon;

  return (
    <Link
      className={clsx(styles.packageCard, styles[product.accent])}
      to={product.href}
    >
      <div className={styles.cardTopline}>
        <span className={styles.iconShell} aria-hidden="true">
          <Icon />
        </span>
        <span className={styles.status}>{product.status}</span>
      </div>
      <span className={styles.eyebrow}>{product.eyebrow}</span>
      <Heading as="h3">{product.name}</Heading>
      <p>{product.description}</p>
      <span className={styles.cardLink}>
        Explore <LuArrowRight aria-hidden="true" />
      </span>
    </Link>
  );
}

function InstrumentPlate() {
  return (
    <figure className={styles.instrumentPlate}>
      <div className={styles.plateFrame}>
        <img
          className={styles.plateImage}
          src={require("@site/static/img/hero-instrumentarium-2.png").default}
          alt="An illuminated manuscript showing an arcane brass astrolabe, maps, alchemical vessels, and a ballista sketch"
        />
        <span className={styles.plateNumber}>Folio IV</span>
      </div>
      <figcaption className={styles.plateCaption}>
        <span>The nex* instrumentarium</span>
        <small>Independent works · one shared canon</small>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <Layout
      title="Achaea packages for Nexus"
      description="The nex* package ecosystem for Achaea's Nexus web client."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={clsx("container", styles.heroInner)}>
            <div className={styles.heroCopy}>
              <div className={styles.releasePill}>
                <LuSparkles aria-hidden="true" />
                <span>The fourth compendium</span>
              </div>
              <Heading as="h1">
                A modern system,
                <span> wrought for Achaea.</span>
              </Heading>
              <p className={styles.heroLead}>
                A collection of honed Nexus packages—each built for a single
                purpose, all speaking a common language.
              </p>
              <div className={styles.heroActions}>
                <Link
                  className={styles.primaryButton}
                  to="/docs/getting-started"
                >
                  Choose your first package <LuArrowRight aria-hidden="true" />
                </Link>
                <Link className={styles.secondaryButton} to="/docs/packages">
                  Browse packages
                </Link>
              </div>
              <div className={styles.heroMeta}>
                <span>
                  <LuBoxes aria-hidden="true" /> Separate works
                </span>
                <span>
                  <LuBraces aria-hidden="true" /> Stable contracts
                </span>
                <span>
                  <LuRadioTower aria-hidden="true" /> Shared signals
                </span>
              </div>
            </div>
            <InstrumentPlate />
          </div>
        </section>

        <section className={styles.packageSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.kicker}>The principal works</span>
                <Heading as="h2">Four instruments. One practiced hand.</Heading>
              </div>
              <Link to="/docs/packages" className={styles.textLink}>
                Compare every package <LuArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.packageGrid}>
              {primaryPackages.map((product) => (
                <PackageCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.foundationSection}>
          <div className={clsx("container", styles.foundationInner)}>
            <div className={styles.foundationCopy}>
              <span className={styles.kicker}>The hidden workings</span>
              <Heading as="h2">Small foundations. Sound construction.</Heading>
              <p>
                Shared event and action layers keep integrations predictable.
                Add combat intelligence when you need deeper target state.
              </p>
            </div>
            <div className={styles.foundationList}>
              {supportingPackages.map((product) => {
                const Icon = product.icon;
                return (
                  <Link
                    key={product.name}
                    to={product.href}
                    className={styles.foundationItem}
                  >
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.role}</small>
                    </span>
                    <LuArrowRight aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.pathSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.kicker}>Find your way in</span>
                <Heading as="h2">Start from where you are.</Heading>
              </div>
            </div>
            <div className={styles.pathGrid}>
              <Link to="/docs/getting-started" className={styles.pathCard}>
                <span className={styles.pathNumber}>01</span>
                <LuBookOpen aria-hidden="true" />
                <Heading as="h3">New to nex*</Heading>
                <p>
                  Choose a first package and understand the shared foundations.
                </p>
                <span>
                  Read the guide <LuArrowRight aria-hidden="true" />
                </span>
              </Link>
              <Link to="/docs/ecosystem" className={styles.pathCard}>
                <span className={styles.pathNumber}>02</span>
                <LuBoxes aria-hidden="true" />
                <Heading as="h3">Building integrations</Heading>
                <p>
                  Learn how package state, events, and public contracts fit
                  together.
                </p>
                <span>
                  See the architecture <LuArrowRight aria-hidden="true" />
                </span>
              </Link>
              <a
                href="https://github.com/NexusUnleashed"
                className={styles.pathCard}
              >
                <span className={styles.pathNumber}>03</span>
                <LuGithub aria-hidden="true" />
                <Heading as="h3">Reading the source</Heading>
                <p>
                  Explore the repositories, releases, and package-owned
                  documentation.
                </p>
                <span>
                  Open GitHub <LuArrowRight aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.compendiumSection}>
          <div className={clsx("container", styles.compendiumInner)}>
            <div className={styles.compendiumMark} aria-hidden="true">
              <LuLibraryBig />
            </div>
            <div className={styles.compendiumCopy}>
              <span className={styles.kicker}>Beyond packages</span>
              <Heading as="h2">The Compendium</Heading>
              <p>
                Living Achaea references that deserve a home of their own:
                canonical Classleads and a searchable Year 1000 Bazaar catalog.
              </p>
            </div>
            <div className={styles.compendiumLinks}>
              <Link to="/compendium/classleads">
                <span>Classleads</span>
                <LuArrowRight aria-hidden="true" />
              </Link>
              <Link to="/compendium/bazaar">
                <span>Year 1000 Bazaar</span>
                <LuArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.labsSection}>
          <div className={clsx("container", styles.labsInner)}>
            <LuFlaskConical aria-hidden="true" />
            <div>
              <strong>nex* Labs</strong>
              <span>
                Early packages, changing ideas, and experiments worth watching.
              </span>
            </div>
            <Link to="/docs/labs">
              Enter the lab <LuArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
