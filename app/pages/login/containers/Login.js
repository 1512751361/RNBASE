import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginButton from '../components/LoginButton';

// @connect(({}) => ({}), dispatch => ({
//   onLoginPress(params) {
//     dispatch({
//       type: 'loginNS/login',
//       payload: params,
//     });
//   },
// }))
class Login extends Component {
  render() {
    const {
      onLoginPress,
    } = this.props;
    return <LoginButton onLoginPress={onLoginPress} />;
  }
}

export default connect(({}) => ({}), dispatch => ({
  onLoginPress(params) {
    dispatch({
      type: 'loginNS/login',
      payload: params,
    });
  },
}))(Login);
