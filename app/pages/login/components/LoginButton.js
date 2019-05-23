import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { I18n } from '../../../lang/i18n';

export default class LoginButton extends PureComponent {
  render() {
    const {
      onLoginPress,
    } = this.props;
    return (
      <View>
        <Text>Wellcom Login Pages</Text>
        <Button title={I18n.t('login.loginBtn')} onPress={onLoginPress} />
      </View>
    );
  }
}
