import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { I18n } from '../../../lang/i18n';
import {
  ReactTextInput,
} from '../../../components';

import Assets from '../../../lib/assets';

export default class LoginButton extends PureComponent {
  render() {
    const {
      onLoginPress,
    } = this.props;
    return (
      <View style={{
        paddingTop: 80,
        paddingHorizontal: 60,
      }}
      >
        <Text>Wellcom Login Pages</Text>
        <View style={{ height: 30 }} />
        <ReactTextInput />
        <View style={{ height: 30 }} />
        <ReactTextInput
            floatingPlaceholder
            labelUri={Assets.icons.ico_phone}
            floatingPlaceholderLeft={0}
            placeholder="请输入手机号"
            underlineColor={{ focus: '#416DD8' }}
            keyboardType="numeric"
            value="phoneTel"
            onChangeText={(val) => {}}
            maxLength={13}
        />
        <View style={{ height: 30 }} />
        <Button title={I18n.t('login.loginBtn')} onPress={onLoginPress} />
      </View>
    );
  }
}
