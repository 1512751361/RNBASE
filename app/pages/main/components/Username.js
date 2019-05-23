import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';

export default class Username extends PureComponent {
  render() {
    const {
      username,
    } = this.props;
    return (
      <View>
        <Text>{username}</Text>
      </View>
    );
  }
}
