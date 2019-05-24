import React, { PureComponent } from 'react';
import { TouchableHighlight } from 'react-native';

export default class RNTouchableHighlight extends PureComponent {
  static defaultProps = {
    waitTime: 1000 * 0.3,
    activeOpacity: 0.9,
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
      activeOpacity,
      ref,
      ...other
    } = this.props;
    return (
      <TouchableHighlight
          {...other}
          ref={ref}
          activeOpacity={activeOpacity}
          onPress={this.debouncePress}
      >
        {children}
      </TouchableHighlight>
    );
  }
}
