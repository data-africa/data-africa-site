import React, {Component} from "react";
import {TopicTitle} from "datawheel-canon";
import Nav from "components/Nav";
import "./About.css";

import {GLOSSARY} from "helpers/glossary";
import {titleCase} from "d3plus-text";

const topics = [
  {
    slug: "background",
    title: "Background"
  },
  {
    slug: "data",
    title: "Data Sources"
  },
  {
    slug: "glossary",
    title: "Glossary"
  },
  {
    slug: "terms",
    title: "Terms of Use"
  }
];

class About extends Component {

  constructor() {
    super();
    this.state = {
      activeSub: false,
      subnav: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const {activeSub, subnav} = this.state;
    const newSub = this.refs.sublinks.getBoundingClientRect().top <= 0;
    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }
  }

  render() {
    const {activeSub, subnav} = this.state;
    return (
      <div className="about">
        <div className="intro">
          <div className="splash">
            <div className="image"></div>
            <div className="gradient"></div>
          </div>
          <div className="header">
            <div className="meta">
                <div className="title">About</div>
            </div>
          </div>
          <div ref="sublinks" className="sublinks">
            {
              topics.map(topic =>
                <a key={ topic.slug } className="sublink" href={ `#${topic.slug}` }>
                  { topic.title }
                </a>
              )
            }
          </div>
        </div>
        <Nav visible={ subnav }>
          {
            topics.map(topic =>
              <a key={ topic.slug } className={activeSub === topic.slug ? "subnav-link active" : "subnav-link"} href={ `#${topic.slug}` }>
                { topic.title }
              </a>
            )
          }
        </Nav>

        
        <section className="section section-background no-border">
          <TopicTitle slug="background">Background</TopicTitle>
          <p className="paragraph">
            Data Africa is an open-source platform designed to provide information
            on key themes such as: health, agriculture, climate, and poverty across Africa. The goal of the site
            is to present to wide audience easy to understand visual narratives related to the key themes.
          </p>
          <p className="paragraph">
            The platform is initially focused around state and province level data for 13 countries, including:
          </p>
          <ul className="paragraph country-list">
            <li>Burkina Faso</li>
            <li>Ethiopia</li>
            <li>Ghana</li>
            <li>Kenya</li>
            <li>Malawi</li>
            <li>Mali</li>
            <li>Mozambique</li>
            <li>Nigeria</li>
            <li>Rwanda</li>
            <li>Senegal</li>
            <li>Tanzania</li>
            <li>Uganda</li>
            <li>Zambia</li>
          </ul>
          <p className="paragraph">
          Over time, we anticipate expanding the coverage of the platform in terms of the number of countries covered as well as increasing the amount of data available through the platform. For any questions, comments, or more information on the site please contact <a href="mailto:hello@dataafrica.io" className="email">hello@dataafrica.io</a>.
          </p>
        </section>

        <section className="section section-data">
          <TopicTitle slug="data">Data Sources</TopicTitle>
          <p className="paragraph">
            The data contained in this site draws from a variety of sources,
            including:
          </p>
          <ul className="paragraph source-list">
            <li><span>Poverty Data</span><a href="http://iresearch.worldbank.org/PovcalNet/povOnDemand.aspx" target="_blank">World Bank's PovcalNet</a></li>
            <li><span>Health Data</span><a href="http://dhsprogram.com/" target="_blank">DHS Program</a></li>
            <li><span>Agricultural Data</span><a href="http://www.ifpri.org/publication/cell5m-geospatial-data-and-analytics-platform-harmonized-multi-disciplinary-data-layers" target="_blank">IFPRI's Cell5M repository</a></li>
            <li><span>Climate Data</span><a href="http://www.cru.uea.ac.uk/data/" target="_blank">University of East Anglia's Climatic Research Unit</a></li>
          </ul>
        </section>

        <section className="section section-glossary">
          <TopicTitle slug="glossary">Glossary</TopicTitle>
          {GLOSSARY.map(entry =>
            <div className="paragraph" key={entry.term} id={entry.term}>
              <p className="term">{entry.term === entry.term.toUpperCase() ? entry.term : titleCase(entry.term)}</p>
              <p className="definition">
              {entry.definition}
              </p>
            </div>
          )}
        </section>

        <section className="section section-toc">
          <TopicTitle slug="terms">Terms of Use</TopicTitle>
          <div className="toc-text">
            <p className="paragraph">
            Information on this site is provided on an "as is" and "as available" basis.
            Data Africa makes every effort to ensure, but does not guarantee,
            the accuracy or completeness of the information on the Data Africa website.
            Our goal is to keep this information timely and accurate.
            If errors are brought to our attention, we will try to correct them.
            Data Africa may add, change, improve, or update the information of the website without notice.
            </p>

            <p className="paragraph">
            Data Africa reserves its exclusive right in its sole discretion to
            alter, limit or discontinue part of this site. Under no circumstances
            shall Data Africa be liable for any loss, damage, liability or expense
            suffered which is claimed to result from use of this site, including
            without limitation, any fault, error, omission, interruption or delay.
            Use of this site is at User's sole risk. We make every effort to minimize
            disruption caused by technical errors. However some data or information
            on the Data Africa website may have been created or structured in files
            or formats which are not error-free and we cannot guarantee that our service
            will not be interrupted or otherwise affected by such problems.
            Data Africa accepts no responsibility with regards to such problems (failure
            of performance, computer virus, communication line failure, alteration of content, etc.)
            incurred as a result of using the Data Africa website or any link to external sites.
            </p>

            <p className="paragraph">
            The User specifically acknowledges and agrees that Data Africa is not liable
            for any conduct of any other User, including, but not limited to, the
            types of conduct listed above.
            </p>

            <p className="paragraph">
            Data Africa reserves the right to deny at its sole discretion any User
            access to the Data Africa website or any portion thereof without notice.
            </p>

            <p className="paragraph">
            For site security purpose and to ensure that the Data Africa website
            remains available to all users, it employs software
            programs to monitor network traffic to identify unauthorised attempts
            to upload or change information, or otherwise cause damage and to detect
            other possible security breaches.
            </p>
          </div>
        </section>

      </div>
    );
  }
}

export default About;
