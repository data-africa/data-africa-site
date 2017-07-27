import React, {Component} from "react";
import Helmet from "react-helmet";
import {AnchorLink, TopicTitle} from "datawheel-canon";
import Nav from "components/Nav";
import "./About.css";

import {GLOSSARY} from "helpers/glossary";
import {titleCase} from "d3plus-text";

import header from "../helmet.js";

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

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    if (!this.sublinks) return;
    const {activeSub, subnav} = this.state;
    const newSub = this.sublinks.getBoundingClientRect().top <= 0;
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
    const title = activeSub ? topics.filter(t => t.slug === activeSub)[0].title : "About";
    return (
      <div className="about">
        <Helmet title={ `${header.title} - ${title}` } />
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
          <div ref={c => this.sublinks = c} className="sublinks">
            {
              topics.map(topic =>
                <AnchorLink key={ topic.slug } className="sublink" to={ topic.slug }>
                  { topic.title }
                </AnchorLink>
              )
            }
          </div>
        </div>
        <Nav visible={ subnav }>
          {
            topics.map(topic =>
              <AnchorLink key={ topic.slug } className={activeSub === topic.slug ? "subnav-link active" : "subnav-link"} to={ topic.slug }>
                { topic.title }
              </AnchorLink>
            )
          }
        </Nav>


        <section className="section section-background no-border">
          <TopicTitle slug="background">Background</TopicTitle>
          <p className="paragraph">
            Data Africa is an open data platform designed to provide information
            on key themes for research and development such as: agriculture, climate, poverty and child health across Sub-Saharan Africa at the sub-national level. The main goal of the online tool is to present the themes to a wide, even non-technical audience through easily accessible visual narratives.
          </p>
          <p className="paragraph">
            In its first stage, the platform is focused on national and sub-national level data for 13 countries:
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
          Over time, we anticipate expanding the coverage of the platform with additional countries and increasing the amount of data available through the platform. For any questions, comments, or more information on the site please contact <a href="mailto:hello@dataafrica.io" className="email">hello@dataafrica.io</a>.
          </p>
        </section>

        <section className="section section-data">
          <TopicTitle slug="data">Data Sources</TopicTitle>
          <p className="paragraph">
            The data contained in the online tool draws from a variety of sources,
            including:
          </p>
          <ul className="paragraph source-list">
            <li><span>Agricultural Data</span><a href="http://www.ifpri.org/publication/cell5m-geospatial-data-and-analytics-platform-harmonized-multi-disciplinary-data-layers" target="_blank">IFPRI's CELL5M Database</a></li>
            <li><span>Climate Data</span><a href="http://www.cru.uea.ac.uk/data/" target="_blank">University of East Anglia's Climatic Research Unit</a></li>
            <li><span>Health Data</span><a href="http://dhsprogram.com/" target="_blank">DHS Program</a></li>
            <li><span>Poverty Data</span><a href="http://iresearch.worldbank.org/PovcalNet/povOnDemand.aspx" target="_blank">World Bank's PovcalNet</a></li>
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

        <section className="section section-glossary">
          <TopicTitle slug="about">About Us</TopicTitle>
          <div className="paragraph">
            <p className="term">HarvestChoice</p>
            <p className="definition">
            Data Africa is a HarvestChoice project website. HarvestChoice,
            jointly implemented by IFPRI and University of Minnesota, generates
            data and knowledge products to support strategic investments on
            agricultural research and development in Africa South of the Sahara (SSA).
            To learn more about HarvestChoice’s related work, visit our
            Catalog, Repository, MapSPAM, AgAtlas, and InSTePP.
            </p>
          </div>

          <div className="paragraph">
            <p className="term">IFPRI</p>
            <p className="definition">
            The International Food Policy Research Institute (IFPRI), established
            in 1975, provides research-based policy solutions to sustainably reduce
            poverty and end hunger and malnutrition. The Institute conducts research,
            communicates results, optimizes partnerships, and builds capacity to
            ensure sustainable food production, promote healthy food systems,
            improve markets and trade, transform agriculture, build resilience,
            and strengthen institutions and governance. Gender is considered in
            all of the Institute’s work. IFPRI collaborates with partners around
            the world, including development implementers, public institutions, the private sector, and farmers’ organizations.
            </p>
          </div>
          <div className="paragraph">
            <p className="term">Datawheel</p>
            <p className="definition">
            Datawheel is a small but mighty crew of programmers and designers
            with a passion for crafting data into predictive, decision-making,
            and storytelling tools. Every visualization platform built by Datawheel is a
            tailored solution that marries the needs of users and the data
            supporting it.
            </p>
          </div>
        </section>

        <section className="section section-glossary">
          <TopicTitle slug="about">Acknowledgement</TopicTitle>
          <div className="paragraph">
            <p className="definition">
            This work was undertaken as part of the HarvestChoice project and the
            CGIAR Research Program on Policies, Institutions, and Markets (PIM),
            led by the International Food Policy Research Institute (IFPRI), in
            collaboration with Datawheel and Barefoot Education for Afrika Trust (BEAT).
            Funding support for this platform was provided by the Bill and Melinda Gates Foundation and USAID Bureau for Food Security.
            Contents in this website have not gone through IFPRI’s standard peer-review procedure.
            The opinions expressed here belong to the authors, and do not necessarily reflect those of PIM, IFPRI, or CGIAR.
            </p>
          </div>
        </section>

        <section className="section section-glossary">
          <TopicTitle slug="about">Citation</TopicTitle>
          <div className="paragraph">
          For the citation of Data Africa, please use:
          <p>
            International Food Policy Research Institute (IFPRI) and Datawheel, 2017. http://DataAfrica.io. Accessed [today’s date].
          </p>
          </div>
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
