require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      /*<div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />Hello
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>*/
      <section className="stage">
        stage
        <section className="img-sec">
          img-sec
        </section>

        <section className="ctrl-nav">
          ctrl-nav
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
