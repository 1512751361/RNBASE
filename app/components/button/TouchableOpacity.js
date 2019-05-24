import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

export default class RNTouchableOpacity extends Component {
  static defaultProps = {
    waitTime: 1000 * 0.3,
  };

  constructor(props) {
    super(props);
    this.prevOnPressTime = null;
    this.debouncePress = this.debouncePress.bind(this);
  }

  debouncePress = () => {
    const {
      onPress,
      waitTime,
    } = this.props;
    const curTime = (new Date()).getTime();
    if (this.prevOnPressTime && curTime - this.prevOnPressTime <= waitTime) return;
    this.prevOnPressTime = curTime;
    if (onPress) onPress();
  }

  render() {
    const {
      children,
      ref,
      ...other
    } = this.props;
    return (
      <TouchableOpacity
          {...other}
          ref={ref}
          onPress={this.debouncePress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
