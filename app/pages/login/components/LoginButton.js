import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { I18n } from '../../../lang/i18n';
import {
  RNTextInput,
  RNButton,
  RNAvatar,
  RNDateTimePicker,
  RNVCodeSlider,
  RNActionSheet,
  RNBorder,
  RNConfirmAlert,
  RNCameraScanPicture,
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
        <RNAvatar width={60} height={60} />
        <View style={{ height: 30 }} />
        <RNTextInput />
        <View style={{ height: 30 }} />
        <RNTextInput
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
        <RNButton title={I18n.t('login.loginBtn')} onPress={onLoginPress} />
        <RNButton
            title="选日期"
            onPress={() => {
              RNDateTimePicker.show({
                onConfirm: (date) => {
                  alert(date);
                },
              });
            }}
        />
        <RNButton
            title="滑块验证码"
            onPress={() => {
              RNVCodeSlider.show({
                onMessage: (message) => {
                  alert(message);
                },
              });
            }}
        />
        <RNButton
            title="ActionSheet"
            onPress={() => {
              RNActionSheet.show({
                cancelButtonIndex: 2,
                options: [
                  { label: '二维码充卡|开卡', onPress: () => this.requestCarmeraPermissionByGoTo({ type: POSBaseComponent.TAB_TYPE.CHARGE, onPressPhone: () => this.onGoToByTokenPress('PhoneCards', { type: POSBaseComponent.TAB_TYPE.CHARGE }) }, this.scanCallback) },
                  { label: '手机号充卡|开卡', onPress: () => this.onGoToByTokenPress('PhoneCards', { type: POSBaseComponent.TAB_TYPE.CHARGE }) },
                  { label: '取消' },
                ],
              });
            }}
        />
        <RNButton
            title="confirm"
            onPress={() => {
              RNConfirmAlert.alert('title', 'contents');
            }}
        />
        <RNButton
            title="扫码"
            onPress={() => {
              RNCameraScanPicture.scan({
                torchModeType: RNCameraScanPicture.TORCH_MODE_TYPE.COLLECT,
                barcodeReceived: (data) => {
                  alert(data);
                },
              });
            }}
        />
        <RNButton
            title="拍照"
            onPress={() => {
              RNCameraScanPicture.picture({
                includeBase64: false,
                getPicture: (src, base64, image) => {
                  alert(src);
                },
              });
            }}
        />
        <View style={{ height: 30 }} />
        <RNBorder
            type="dashed"
            borderTopWidth={1}
            borderColor="#ddd"
        />
      </View>
    );
  }
}
