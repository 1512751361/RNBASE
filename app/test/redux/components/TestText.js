import React, { Component } from 'react';
import { Text } from 'react-native';

export default class TestText extends Component {
  render() {
    const { value } = this.props;
    return (
      <Text>{value}</Text>
    );
  }
}
