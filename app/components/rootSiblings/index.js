import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';
// import RootSiblings from 'react-native-root-siblings';
import RootSiblings from './RootSiblings';
import RNTouchableOpacity from '../button/TouchableOpacity';
import Assets from './assets';

const scaleZoom = 2;

const styles = StyleSheet.create({
  sibling: {
    height: scaleZoom > 1 ? 1336 : Dimensions.get('window').height,
    width: scaleZoom > 1 ? 750 : Dimensions.get('window').width,
    backgroundColor: '#00000050',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  loadView: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12 * scaleZoom,
    flexDirection: 'row',
    paddingVertical: 15 * scaleZoom,
    paddingHorizontal: 25 * scaleZoom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadText: {
    fontSize: 15 * scaleZoom,
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10 * scaleZoom,
    opacity: 0.9,
  },
  successText: {
    fontSize: 15 * scaleZoom,
    color: '#fff',
    textAlign: 'center',
  },
});

export default class RNRootSiblings {
  static elements = [];

  static loadElements = [];

  static loadTimer = null;

  static show = (view, options = {}) => { // 外界传入view
    const {
      onModalMaskPress,
      isModalMaskPressHide,
      isOnBackHide,
      containerStyle,
    } = options || {};
    this.isOnBackHide = isOnBackHide;
    const sibling = new RootSiblings(
      <View style={[styles.sibling, containerStyle]}>
        <RNTouchableOpacity
            style={styles.modalMask}
            activeOpacity={1}
            onPress={() => {
            if (!isModalMaskPressHide) RNRootSiblings.hide(sibling);
            if (onModalMaskPress) onModalMaskPress();
          }}
        />
        {React.cloneElement(view, { onDestroyPress: () => RNRootSiblings.hide(sibling) })}
      </View>,
      () => {},
    );
    RNRootSiblings.elements.push(sibling);
    return sibling;
  };

  static hide = (sibling) => {
    if (sibling && RNRootSiblings.elements && RNRootSiblings.elements.length) {
      const index = RNRootSiblings.elements.indexOf(sibling);
      if (index !== -1) {
        sibling.destroy();
        RNRootSiblings.elements.splice(index, 1);
        return;
      }
    }
    const lastSibling = RNRootSiblings.elements.pop();
    if (lastSibling) lastSibling.destroy();
  };

  static update = (sibling, view) => {
    if (sibling) {
      sibling.update(
        <View style={styles.sibling}>
          <RNTouchableOpacity
              style={styles.modalMask}
              activeOpacity={1}
              onPress={() => { RNRootSiblings.hide(sibling); }}
          />
          {React.cloneElement(view, { onDestroyPress: () => RNRootSiblings.hide(sibling) })}
        </View>,
        () => {},
      );
    }
  }

  static backHandler = () => {
    if (RNRootSiblings.loadElements && RNRootSiblings.loadElements.length) {
      if (!this.isOnBackHide) RNRootSiblings.hideLoad();
      return true;
    }
    if (RNRootSiblings.elements && RNRootSiblings.elements.length) {
      if (!this.isOnBackHide) RNRootSiblings.hide();
      return true;
    }
    return false;
  }

  static loading = (message = '正在请求中...', view) => {
    RNRootSiblings.hideLoad();
    const sibling = new RootSiblings(
      <View style={styles.sibling}>
        {view ? React.cloneElement(view, {
          message,
          onDestroyPress: () => RNRootSiblings.hideLoad(sibling),
        })
          : (
            <View style={styles.loadView}>
              <ActivityIndicator animating size={scaleZoom > 1 ? 'large' : 'small'} />
              <Text style={styles.loadText}>
                {message}
              </Text>
            </View>
          )}
      </View>,
    );
    RNRootSiblings.loadElements.push(sibling);
    return sibling;
  }

  static error = (message = '加载失败！', options = {}, view) => {
    RNRootSiblings.hideLoad();
    const {
      timer = 1000 * 2,
    } = options || {};
    const sibling = new RootSiblings(
      <View style={styles.sibling}>
        {view ? React.cloneElement(view, {
          message,
          onDestroyPress: () => RNRootSiblings.hideLoad(sibling),
        })
          : (
            <View style={styles.loadView}>
              <Text style={styles.loadText}>
                {message}
              </Text>
            </View>
          )}
      </View>,
    );
    RNRootSiblings.loadElements.push(sibling);
    if (RNRootSiblings.loadTimer) {
      clearTimeout(RNRootSiblings.loadTimer);
    }
    RNRootSiblings.loadTimer = setTimeout(() => {
      if (sibling) RNRootSiblings.hideLoad(sibling);
    }, timer && typeof (timer) === 'number' ? timer : 1000 * 2);
    return sibling;
  }

  static success = (message = '加载成功！', options = {}, view) => {
    RNRootSiblings.hideLoad();
    const {
      width = 358 / 2 * scaleZoom,
      minHeight = 310 / 2 * scaleZoom,
      uri,
      timer = 1000 * 2,
    } = options || {};
    const source = uri || Assets.success;
    const sibling = new RootSiblings(
      <View style={styles.sibling}>
        {view ? React.cloneElement(view, {
          message,
          onDestroyPress: () => RNRootSiblings.hideLoad(sibling),
        })
          : (
            <View style={[{
              width,
              minHeight,
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 12 * scaleZoom,
              paddingTop: 30 * scaleZoom,
            }]}
            >
              <View style={{
                alignItems: 'center',
                paddingBottom: 30 * scaleZoom,
              }}
              >
                <Image
                    source={source}
                    style={{
                    width: 50 * scaleZoom,
                    height: 50 * scaleZoom,
                  }}
                />
              </View>
              <Text style={styles.successText}>
                {message}
              </Text>
            </View>
          )}
      </View>,
    );
    RNRootSiblings.loadElements.push(sibling);
    if (RNRootSiblings.loadTimer) {
      clearTimeout(RNRootSiblings.loadTimer);
    }
    RNRootSiblings.loadTimer = setTimeout(() => {
      if (sibling) RNRootSiblings.hideLoad(sibling);
    }, timer && typeof (timer) === 'number' ? timer : 1000 * 2);
    return sibling;
  }

  static hideLoad = (sibling) => {
    if (sibling && RNRootSiblings.loadElements && RNRootSiblings.loadElements.length) {
      const index = RNRootSiblings.loadElements.indexOf(sibling);
      if (index !== -1) {
        sibling.destroy();
        RNRootSiblings.loadElements.splice(index, 1);
        return;
      }
    }
    const lastSibling = RNRootSiblings.loadElements.pop();
    if (lastSibling) lastSibling.destroy();
  }
}
