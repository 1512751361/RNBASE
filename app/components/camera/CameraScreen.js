/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
} from 'react-native';
// import Toast from 'react-native-simple-toast';
import RNCamera from './Camera';
import Assets from './assets';
import RNTouchableWithoutFeedback from '../button/TouchableWithoutFeedback';
import RNTouchableOpacity from '../button/TouchableOpacity';
import { statusBarHeight, iPhoneXBottom } from '../../lib/screenUtil';

export const scaleZoom = 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10 * scaleZoom,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40 * scaleZoom,
    marginHorizontal: 2,
    marginBottom: 10 * scaleZoom,
    marginTop: 20 * scaleZoom,
    borderRadius: 8 * scaleZoom,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15 * scaleZoom,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70 * scaleZoom,
    zIndex: 2,
    left: 2 * scaleZoom,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
});

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.btnRender = this.btnRender.bind(this);
    this.toggleFacing = this.toggleFacing.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.pictureClose = this.pictureClose.bind(this);
    this.pictureOK = this.pictureOK.bind(this);
    this.toggleWB = this.toggleWB.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.setFocusDepth = this.setFocusDepth.bind(this);
    this.takeVideo = this.takeVideo.bind(this);

    const includeBase64 = props.includeBase64 !== undefined ? props.includeBase64 : true;
    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      recordOptions: {
        mute: false,
        maxDuration: 5,
        quality: RNCamera.Constants.VideoQuality['288p'],
      },
      pictureOptions: {
        base64: includeBase64,
        quality: 0.8,
      },
      isRecording: false,
      src: '',
      base64: '',
      image: null,
      isTakePicture: false,
    };
  }

  componentWillUnmount() {
    const {
      goToBackCallback,
    } = this.props;
    if (goToBackCallback) goToBackCallback();
  }

  onClosePress = () => {
    const {
      onDestroyPress,
    } = this.props;
    if (onDestroyPress) onDestroyPress();
  }

  toggleFacing = () => {
    const {
      type,
    } = this.state;
    this.setState({
      type: type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back,
    });
  }

  toggleFlash = () => {
    const {
      flash,
    } = this.state;
    this.setState({
      flash: flashModeOrder[flash],
    });
  }

  toggleWB = () => {
    const {
      whiteBalance,
    } = this.state;
    this.setState({
      whiteBalance: wbOrder[whiteBalance],
    });
  }

  toggleFocus = () => {
    const {
      autoFocus,
    } = this.state;
    this.setState({
      autoFocus: autoFocus === 'on' ? 'off' : 'on',
    });
  }

  zoomOut = () => {
    const {
      zoom,
    } = this.state;
    this.setState({
      zoom: zoom - 0.1 < 0 ? 0 : zoom - 0.1,
    });
  }

  zoomIn = () => {
    const {
      zoom,
    } = this.state;
    this.setState({
      zoom: zoom + 0.1 > 1 ? 1 : zoom + 0.1,
    });
  }

  setFocusDepth = (depth) => {
    this.setState({
      depth,
    });
  }

  // 拍摄照片
  takePicture = async () => {
    const {
      pictureOptions,
    } = this.state;
    if (this.camera) {
      const data = await this.camera.takePictureAsync(pictureOptions);
      if (data && (data.uri || data.base64)) {
        this.camera.pausePreview();
        this.setState({
          src: data.uri, isTakePicture: true, base64: data.base64, image: data,
        });
      } else {
        // Toast.show('拍摄照片失败！');
        alert('拍摄照片失败！');
      }
    }
  };

  // 取消拍照
  pictureClose = () => {
    this.setState({ isTakePicture: false });
    if (this.camera) {
      this.camera.resumePreview();
    }
  }

  // 确认拍照
  pictureOK = async () => {
    const { getPicture } = this.props;
    const { src, base64, image } = this.state;
    if (src || base64) {
      // this.setState({isTakePicture:false});
      if (getPicture) getPicture(src, base64, image);
      this.onClosePress();
    }
  }

  // 拍摄视频
  takeVideo = async () => {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;
          this.setState({ isRecording: false });
          console.warn('takeVideo', data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 操作按钮
  btnRender = () => {
    const {
      flashMode,
      isTakePicture,
      flash,
    } = this.state;
    if (isTakePicture) {
      return (
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}
        >
          <RNTouchableWithoutFeedback onPress={this.pictureClose}>
            <Image
                source={Assets.ico_camera_cloes}
                style={{
                  width: 48 * scaleZoom,
                  height: 48 * scaleZoom,
                }}
            />
          </RNTouchableWithoutFeedback>
          <View style={{ width: 61 * scaleZoom, height: 61 * scaleZoom }} />
          <RNTouchableWithoutFeedback onPress={this.pictureOK}>
            <Image
                source={Assets.ico_camera_ok}
                style={{
                  width: 48 * scaleZoom,
                  height: 48 * scaleZoom,
                }}
            />
          </RNTouchableWithoutFeedback>
        </View>
      );
    }
    return (
      <View style={{
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}
      >
        <RNTouchableWithoutFeedback onPress={this.toggleFlash}>
          {
            flash === 'torch' || flash === 'on'
            ? (
              <Image
                  source={Assets.ico_camera_flashlight_on}
                  style={{
                    width: 48 * scaleZoom,
                    height: 48 * scaleZoom,
                  }}
              />
            )
            : (
              <Image
                  source={Assets.ico_camera_flashlight}
                  style={{
                  width: 48 * scaleZoom,
                  height: 48 * scaleZoom,
                }}
              />
          )}
        </RNTouchableWithoutFeedback>
        <RNTouchableWithoutFeedback onPress={this.takePicture}>
          <Image
              source={Assets.ico_camera_shoot}
              style={{
                  width: 61 * scaleZoom,
                  height: 61 * scaleZoom,
                }}
          />
        </RNTouchableWithoutFeedback>
        <RNTouchableWithoutFeedback onPress={this.toggleFacing}>
          <Image
              source={Assets.ico_camera_camera}
              style={{
                  width: 48 * scaleZoom,
                  height: 48 * scaleZoom,
                }}
          />
        </RNTouchableWithoutFeedback>
      </View>
    );
  }

  renderCamera() {
    const {
      type,
      flash,
    } = this.state;
    return (
      <RNCamera
          ref={(ref) => { this.camera = ref; }}
          style={{ flex: 1 }}
          captureAudio={false}
          type={type} // 前后摄像头切换
          flashMode={flash} // 闪光灯 torch 打开
          autoFocus={this.state.autoFocus} // 焦点
          zoom={this.state.zoom} // 缩放
          whiteBalance={this.state.whiteBalance} // 屏幕背景
          ratio={this.state.ratio} // 比例
          focusDepth={this.state.depth} // 设置depth值
          permissionDialogTitle="Permission to use camera" // 授权提示标题
          permissionDialogMessage="使用相机拍摄照片" // 授权提示内容
      >
        <StatusBar
            animated
            hidden={false}
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
        />
        <View style={{
            position: 'absolute',
            left: 15 * scaleZoom,
            top: 15 * scaleZoom + statusBarHeight,
            width: 30 * scaleZoom,
            height: 30 * scaleZoom,
            zIndex: 100,
          }}
        >
          <RNTouchableOpacity onPress={this.onClosePress}>
            <Image
                source={Assets.ico_camera_back}
                style={{
                  width: 30 * scaleZoom,
                  height: 30 * scaleZoom,
                }}
            />
          </RNTouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{
          padding: 25 * scaleZoom,
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.8)',
          paddingBottom: (iPhoneXBottom + 25) * scaleZoom,
        }}
        >
          {this.btnRender()}
        </View>
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}
