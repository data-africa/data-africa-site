import React, {Component} from "react";
import "./Section.css";

class Sections extends Component {

  render() {
    const {data, profile} = this.props;

    return (
      <div className="sections">

        {
          data.map(s =>
            <div className="section" key={ s.slug }>
              <h2><a name={ s.slug } href={ `#${ s.slug }`}>{ s.title }</a></h2>
              {
                s.topics.map((Comp, i) => {
                  let params = {};
                  if (Array.isArray(Comp)) [Comp, params] = Comp;
                  return React.createElement(Comp, {profile, key: i, ...params}, null);
                })
              }
            </div>
          )
        }

      </div>
    );
  }

}

Sections.defaultProps = {data: [], profile: {}};
export default Sections;
