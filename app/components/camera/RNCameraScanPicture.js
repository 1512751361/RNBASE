import React, { PureComponent } from 'react';
import {
  Alert,
} from 'react-native';
import RNCamera from './Camera';
import CameraScreen from './CameraScreen';
import ScanPage from './ScanPage';
import RNRootSiblings from '../rootSiblings';

class RNCameraScanPicture extends PureComponent {
  TORCH_MODE_TYPE = ScanPage.TORCH_MODE_TYPE

  constructor(props) {
    super(props);
    this.scan = this.scan.bind(this);
    this.picture = this.picture.bind(this);
  }

  scan = (props) => {
    RNCamera.getRequestCarmeraPermission().then((res) => {
      if (!res) {
        Alert.alert('相机权限没打开', '请在iPhone的“设置-隐私”选项中,允许访问您的摄像头和麦克风');
        return;
      }
      RNRootSiblings.show(<ScanPage {...props} />, {
        containerStyle: {
          flex: 1,
          backgroundColor: '#000',
          alignItems: undefined,
          justifyContent: undefined,
        },
        isModalMaskPressHide: true,
      });
    }).catch((err) => {
      Alert.alert('相机权限没打开', `获取相机权限失败：${JSON.stringify(err)}`);
    });
  }

  picture = (props) => {
    RNCamera.getRequestCarmeraPermission().then((res) => {
      if (!res) {
        Alert.alert('相机权限没打开', '请在iPhone的“设置-隐私”选项中,允许访问您的摄像头和麦克风');
        return;
      }
      RNRootSiblings.show(<CameraScreen {...props} />, {
        containerStyle: {
          flex: 1,
          backgroundColor: '#000',
          alignItems: undefined,
          justifyContent: undefined,
        },
        isModalMaskPressHide: true,
      });
    }).catch((err) => {
      Alert.alert('相机权限没打开', `获取相机权限失败：${JSON.stringify(err)}`);
    });
  }

  render() {
    return null;
  }
}

export default new RNCameraScanPicture();
