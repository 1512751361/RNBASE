/** *
 * 设备分辨率适配(px,dp)容器
 *  */
import React from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    StatusBar,
    View,
    NativeModules,
} from 'react-native';

const { StatusBarManager } = NativeModules;
const isIOS = Platform.OS === 'ios';// ios系统
let statusBarHeight = isIOS ? (isIphoneX ? 44 : 20) : (StatusBar.currentHeight || StatusBarManager.HEIGHT); // eslint-disable-line
if (isIOS) {
  StatusBarManager.getHeight(data => (statusBarHeight = data.height));
}

const props = {};
export default class Resolution {
  static get(useFixWidth = true) {
    return useFixWidth ? { ...props.fw } : { ...props.fh };
  }

  static setDesignSize(dwidth = 750, dheight = 1336, dim = 'window', isStatusBar) {
    const designSize = { width: dwidth, height: dheight };

    const navHeight = isStatusBar ? statusBarHeight : 0;
    const pxRatio = PixelRatio.get(dim);
    let { width, height } = Dimensions.get(dim);
    if (dim !== 'screen') height -= navHeight;
    // dp-=>px
    const w = PixelRatio.getPixelSizeForLayoutSize(width);
    const h = PixelRatio.getPixelSizeForLayoutSize(height);

    const fwDesignScale = designSize.width / w;
    const fwWidth = designSize.width;
    const fwHeight = h * fwDesignScale;
    const fwScale = 1 / pxRatio / fwDesignScale;

    const fhDesignScale = designSize.height / h;
    const fhWidth = w * fhDesignScale;
    const fhHeight = designSize.height;
    const fhScale = 1 / pxRatio / fhDesignScale;

    props.fw = {
      width: fwWidth, height: fwHeight, scale: fwScale, navHeight,
    };
    props.fh = {
      width: fhWidth, height: fhHeight, scale: fhScale, navHeight,
    };
  }

  static FixWidthView = (p) => {
    const {
      width, height, scale, navHeight,
    } = props.fw;
    return (
      <View
          {...p}
          style={{
            width,
            height,
            marginTop: navHeight,
            backgroundColor: 'transparent',
            transform: [{
              translateX: -width * 0.5,
            }, {
              translateY: -height * 0.5,
            }, {
              scale,
            }, {
              translateX: width * 0.5,
            }, {
              translateY: height * 0.5,
            }],
          }}
      />
    );
  };

  static FixHeightView = (p) => {
    const {
      width, height, scale, navHeight,
    } = props.fh;
    return (
      <View
          {...p}
          style={{
            marginTop: navHeight,
            width,
            height,
            backgroundColor: 'transparent',
            transform: [{
              translateX: -width * 0.5,
            }, {
              translateY: -height * 0.5,
            }, {
              scale,
            }, {
              translateX: width * 0.5,
            }, {
              translateY: height * 0.5,
            }],
          }}
      >
        {p.children}
      </View>
    );
  };
}
// init
Resolution.setDesignSize();
