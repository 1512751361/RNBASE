import React, { Component } from 'react';
import { connect } from 'react-redux';
import Username from '../components/Username';

// @connect(({ mainNS }) => ({ ...mainNS }))
class Main extends Component {
  render() {
    return <Username {...this.props} />;
  }
}
export default connect(({ mainNS }) => ({ ...mainNS }))(Main);
