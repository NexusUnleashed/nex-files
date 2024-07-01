import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Enhance your Experience",
    Svg: require("@site/static/img/GeminiWheel.jpg").default,
    description: (
      <>
        Nexus packages designed to enhance your Achaea gameplay experience.
        These packages were developed to solve nagging QoL issues and provide
        powerful funcationlity for advanced users.
      </>
    ),
  },
  {
    title: "Simple to Start",
    Svg: require("@site/static/img/GeminiShield.jpg").default,
    description: (
      <>
        Packages are designed with the <b>new player</b> in mind. With minimal
        configuration to get you going right out of the box.
      </>
    ),
  },
  {
    title: "Endless Customization",
    Svg: require("@site/static/img/GeminiTools.jpg").default,
    description: (
      <>
        Advanced users will find a wealth of purpose built functions and API
        calls enbaling advanced usage and integration with other packages.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={Svg} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
