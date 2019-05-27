/**
 * 创建时间：2018/4/19
 * 描述：滑动图片验证码组件
 * */
import React, { Component } from 'react';
import {
  Dimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import WebView from 'react-native-webview';

import { scaleZoom } from '../constants';

const w = scaleZoom > 1 ? 750 : Dimensions.get('window').width; // 设备的宽度
const h = scaleZoom > 1 ? 1336 : Dimensions.get('window').height; // 设备的高度

export default class ReactVCodeSlider extends Component {
  static displayName = 'ReactVCodeSlider'

  static propTypes = {
    onMessage: PropTypes.func,
  }

  static defaultProps = {
    onMessage: message => null,
  }

  constructor(props) {
    super(props);
    this.tcTimeout = null;
    this.isShow = true;
    this.RNwebview = null;

    this.showTCaptcha = this.showTCaptcha.bind(this);
    this.closeTCTimeout = this.closeTCTimeout.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClosePress = this.onClosePress.bind(this);
  }

  componentDidMount() {
    this.onShow();
  }

  componentWillUnmount() {
    this.isShow = null;
    this.closeTCTimeout();
  }

  showTCaptcha = () => {
    this.tcTimeout = setTimeout(() => {
      if (this.RNwebview) this.RNwebview.postMessage('open');
      this.showTCaptcha();
    }, 1000);
  }

  closeTCTimeout = () => {
    if (this.tcTimeout) {
      clearTimeout(this.tcTimeout);
      this.tcTimeout = null;
    }
  }

  onShow = () => {
    if (this.RNwebview) {
      this.isShow = true;
      this.RNwebview.postMessage('open');
    }
    this.showTCaptcha();
  }

  onMessage = (evt) => {
    const {
      onMessage,
    } = this.props;
    const message = evt.nativeEvent.data;
    this.closeTCTimeout();
    if (message === 'close') {
      if (this.isShow) {
        this.onClosePress(false);
      }
    } else if (message === 'show') {
      console.log('show');
      this.isShow = true;
    } else {
      if (this.isShow) {
        this.onClosePress(false);
      }
      try {
        const params = JSON.parse(message);
        setTimeout(() => {
          if (onMessage) onMessage(params);
        }, 10);
      } catch (error) {
        //
      }
    }
  }

  onClosePress = (isVisible) => {
    const { onDestroyPress } = this.props;
    this.isShow = false;
    if (onDestroyPress) onDestroyPress();
  }

  render() {
    const patchPostMessageFunction = () => {
      const originalPostMessage = window.postMessage;
      const patchedPostMessage = (message, targetOrigin, transfer) => {
        originalPostMessage(message, targetOrigin, transfer);
      };
      patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      window.postMessage = patchedPostMessage;
    };
    const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})();`;
    return (
      <View style={{
        width: w,
        height: h,
      }}
      >
        <WebView
            allowFileAccess
            scalesPageToFit
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            bounces={false}
            injectedJavaScript={patchPostMessageJsCode}
            ref={e => this.RNwebview = e}
            decelerationRate="normal"
            originWhitelist={['*']}
            source={{ uri: './assets/html/TCaptcha.html' }}
            onMessage={this.onMessage}
            style={{ width: w, height: h, backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
}
