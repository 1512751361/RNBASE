/**
 * 屏幕工具类 以及一些常用的工具类封装
 * ui设计基准,iphone 6 2倍图
 * width:750px
 * height:1334px
 * @2x
 */
import {
  PixelRatio,
  Dimensions,
  Platform,
  AsyncStorage,
  NativeModules,
} from 'react-native';

export const isAndroid = Platform.OS === 'android';// android 系统
export const isIOS = Platform.OS === 'ios';// ios系统
export const screenWidth = Dimensions.get('window').width; // 设备的宽度
export const screenHeight = Dimensions.get('window').height; // 设备的高度

const { StatusBarManager } = NativeModules;
export const isSmallScreen = screenWidth <= 340;
export const isShortScreen = screenHeight <= 600;
/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export const isIphoneX = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
        && ((screenHeight === X_HEIGHT && screenWidth === X_WIDTH)
            || (screenHeight === X_WIDTH && screenWidth === X_HEIGHT));

export let statusBarHeight = isIOS ? (isIphoneX?44:20) : StatusBarManager.HEIGHT; // eslint-disable-line
// export const isIphoneX = isIOS && !Platform.isPad && !Platform.isTVOS && (screenHeight === 812 || screenWidth === 812);

export const iPhoneXBottom = isIphoneX ? 25 : 0;

// override guesstimate height with the actual height from StatusBarManager
if (isIOS) {
  StatusBarManager.getHeight(data => (statusBarHeight = data.height));
}


const fontScale = PixelRatio.getFontScale();// 返回字体大小缩放比例
export const pixelRatio = PixelRatio.get();// 当前设备的像素密度
// 像素密度
export const DEFAULT_DENSITY = 2;
// px转换成dp
// 以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为2倍图时
const defaultWidth = 375 * 2;
const defaultHeight = 667 * 2;
const w2 = defaultWidth / DEFAULT_DENSITY;
// px转换成dp
const h2 = defaultHeight / DEFAULT_DENSITY;

// 缩放比例
const SCALE_WIDTH = screenWidth / defaultWidth;
const SCALE_HEIGHT = screenHeight / defaultHeight;

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

/**
 * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
 * 横向的尺寸直接使用此方法
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleSize(size) {
  return size * SCALE_WIDTH;
}

/**
 * 屏幕适配 , 纵向的尺寸使用此方法应该会更趋近于设计稿
 * 如：height ,paddingVertical ,paddingTop ,paddingBottom ,marginVertical ,marginTop ,marginBottom
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleHeight(size) {
  return size * SCALE_HEIGHT;
}

/* 最初版本尺寸适配方案 也许你会更喜欢这个
export function scaleSize(size: Number) {
    let scaleW = screenWidth / w2;
    let scaleH = screenHeight / h2;
    let scale = Math.min(scaleW, scaleH);
    size = Math.round((size * scale + 0.5));
    return size / DEFAULT_DENSITY;
} */

/**
 * 设置字体的size（单位px）
 * @param size 传入设计稿上的px , allowFontScaling 是否根据设备文字缩放比例调整，默认不会
 * @returns {Number} 返回实际sp
 */
function setSpText(size, allowFontScaling = false) {
  const scale = Math.min(SCALE_WIDTH, SCALE_HEIGHT);
  const fontSize = allowFontScaling ? 1 : fontScale;
  return size * scale / fontSize;
}

export function setSpText2(size) {
  const scaleW = screenWidth / w2;
  const scaleH = screenHeight / h2;
  const scale = Math.min(scaleW, scaleH);
  const newsize = Math.round((size * scale + 0.5));

  return newsize / DEFAULT_DENSITY * fontScale;
}

/**
 * 根据是否是iPhoneX返回不同的样式
 * @param iphoneXStyle
 * @param iosStyle
 * @param androidStyle
 * @returns {*}
 */
export function ifIphoneX(iphoneXStyle, iosStyle = {}, androidStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  } if (Platform.OS === 'ios') {
    return iosStyle;
  }
  if (androidStyle) return androidStyle;
  return iosStyle;
}

/**
 * 存储
 * @param key
 * @param value
 * @param successCallback
 * @param errorCallback
 */
export function saveAsyncStorage(key, value, successCallback, errorCallback) {
  AsyncStorage.setItem(key, value, (error) => {
    if (error) {
      errorCallback(error);
    } else {
      successCallback();
    }
  });
}

/**
 * 取值
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function getAsyncStorage(key, successCallback, errorCallback) {
  AsyncStorage.getItem(key, (error, result) => {
    if (error) {
      errorCallback(error);
    } else {
      successCallback(result);
    }
  });
}

/**
 * 删除对应key的
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function removeAsyncStorage(key, successCallback, errorCallback) {
  AsyncStorage.getItem(key, (error) => {
    if (error) {
      errorCallback(error);
    } else {
      successCallback();
    }
  });
}
