import React from 'react';
import {
  PermissionsAndroid,
  Alert,
  Platform,
  NativeModules,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraManager = NativeModules.CameraManager || NativeModules.CameraModule;

RNCamera.getRequestCarmeraPermission = () => new Promise((resolve, reject) => {
  try {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Toast.show("你已获取了相机权限")
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(err => reject(err));
    } else if (CameraManager && CameraManager.checkVideoAuthorizationStatus) {
      CameraManager.checkVideoAuthorizationStatus().then((res) => {
        if (res) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(err => reject(err));
    } else {
      resolve(true);
    }
  } catch (err) {
    reject(err);
  }
});

export default RNCamera;
