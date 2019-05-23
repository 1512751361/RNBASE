import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';

export default class LoginButton extends PureComponent {
  render() {
    const {
      onLoginPress,
    } = this.props;
    return (
      <View>
        <Text>Wellcom Login Pages</Text>
        <Button title="loginIn" onPress={onLoginPress}>Login In</Button>
      </View>
    );
  }
}
