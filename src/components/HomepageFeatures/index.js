import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import {useColorMode} from '@docusaurus/theme-common';

const FeatureList = [
  {
    title: 'NO Magic',
    Svg: require('@site/static/img/no-magic.svg').default,
    description: (
      <>
        What it does is clear!
        You can also take the code (about 70 lines) and paste it into your project
      </>
    ),
  },
  {
    title: 'NO Multi-Purpose',
    Svg: require('@site/static/img/no-multitool.svg').default,
    description: (
      <>
        Designed ONLY to manage the STORE
        It serves no other purpose!
      </>
    ),
  },
  {
    title: 'NO Community',
    Svg: require('@site/static/img/no-community.svg').default,
    description: (
      <>
        Any bugs reported will be fixed.
        But Jon will remain unchanged for quite some time
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  const {colorMode} = useColorMode();

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
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
