/**
 * 创建时间：2018/7/9
 * 描述：扫码
 * */
import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  StatusBar,
} from 'react-native';
// import { connect } from 'react-redux';
// import Toast from 'react-native-simple-toast';
import QRScannerView, { scaleZoom } from './QRScanner';
import Assets from './assets';
import { statusBarHeight, iPhoneXBottom } from '../../lib/screenUtil';
import RNTouchableOpacity from '../button/TouchableOpacity';

class ScanPage extends Component {
  static TORCH_MODE_TYPE = {
    COLLECT: 'COLLECT',
    RECHAR: 'RECHAR',
  }

  constructor(props) {
    super(props);
    this.renderSwitchTorchMode = this.renderSwitchTorchMode.bind(this);
    this.switchTorchMode = this.switchTorchMode.bind(this);
    this.onPressPhone = this.onPressPhone.bind(this);
    this.barcodeReceived = this.barcodeReceived.bind(this);
    this.onClosePress = this.onClosePress.bind(this);
    this.isScan = false;
    this.state = {
      torchMode: 'off',
    };
  }

  componentWillMount() {
    this.isScan = false;
  }

  componentWillUnmount() {
    this.isScan = false;
  }

  onClosePress = () => {
    const {
      onDestroyPress,
    } = this.props;
    if (onDestroyPress) onDestroyPress();
  }

  renderSwitchTorchMode = () => {
    const {
      torchMode,
    } = this.state;
    const {
      torchModeType,
    } = this.props;
    if (torchMode === 'on') {
      if (torchModeType === ScanPage.TORCH_MODE_TYPE.COLLECT) {
        return (
          <Image
              source={Assets.ico_green_diantong_pre}
              style={{
                width: 134 / 2 * scaleZoom,
                height: 134 / 2 * scaleZoom,
              }}
          />
        );
      }
      return (
        <Image
            source={Assets.ico_diantong_pre}
            style={{
              width: 134 / 2 * scaleZoom,
              height: 134 / 2 * scaleZoom,
            }}
        />
      );
    }
    return (
      <Image
          source={Assets.ico_diantong_normal}
          style={{
            width: 45 * scaleZoom,
            height: 45 * scaleZoom,
          }}
      />
    );
  }

  switchTorchMode = () => {
    let { torchMode } = this.state;
    if (torchMode === 'on') {
      torchMode = 'off';
    } else {
      torchMode = 'on';
    }
    this.setState({ torchMode });
  }

  onPressPhone = () => {
    const {
      onPressPhone,
    } = this.props;
    this.onClosePress();
    if (onPressPhone) onPressPhone();
    // this._navigation('PhoneCards', { type: this.params.type, amount: this.params.amount, transactionSuccess });
  }

  barcodeReceived = (e) => {
    if (this.isScan) return;
    const {
      barcodeReceived,
    } = this.props;
    this.isScan = true;
    if (e && e.data) {
      if (barcodeReceived) barcodeReceived(e.data);
      this.isScan = false;
      this.onClosePress();
    } else {
      this.isScan = false;
    }
  }

  render() {
    const reactWidth = 250 * scaleZoom;
    const reactHeight = 250 * scaleZoom;
    const bottomMenuHeight = (267 / 2 + iPhoneXBottom) * scaleZoom;
    const hintTextPosition = (1336 - reactHeight - bottomMenuHeight) / 2 - 23 * scaleZoom;
    const {
      torchModeType,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
            animated
            hidden={false}
            translucent
            barStyle="dark-content"
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
        <QRScannerView
            torchMode={this.state.torchMode}
            reactWidth={reactWidth}
            reactHeight={reactHeight}
            maskColor="rgba(0,0,0,0.70)"
            cornerColor={torchModeType === ScanPage.TORCH_MODE_TYPE.COLLECT ? '#32CCA7' : '#37A0FF'}
            connerBorderWidth={3 * scaleZoom}
            connerBorderLength={40 * scaleZoom}
            isCornerOffset
            cornerOffsetSize={3 * scaleZoom}
            borderColor="rgba(0,0,0,0.70)"
            renderTopBarView={() => null}
            hintText="请将二维码置于框内"
            hintTextPosition={hintTextPosition}
            hintTextStyle={{
              opacity: 0.7,
              color: '#fff',
              fontSize: 14 * scaleZoom,
            }}
            isShowScanBar
            scanBarColor="rgba(48,152,252,0.56)"
            scanBarMargin={0}
            scanBarImage={torchModeType === ScanPage.TORCH_MODE_TYPE.COLLECT ? Assets.pic_scaning : Assets.pic_scaning}
            scanBarHeight={148 / 511 * (reactWidth - 6 * scaleZoom)}
            scanBarOffsetY={-148 / 511 * (reactWidth - 6 * scaleZoom)}
            scanBarImageStyle={{
              height: 148 / 511 * (reactWidth - 6 * scaleZoom),
            }}
            bottomMenuStyle={{
              height: bottomMenuHeight,
              backgroundColor: 'rgba(0,0,0,0.70)',
            }}
            bottomMenuHeight={bottomMenuHeight}
            renderBottomMenuView={() => (
              <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
              >
                <TouchableWithoutFeedback onPress={this.onPressPhone}>
                  <View style={{
                    alignItems: 'center',
                    marginLeft: 22 * scaleZoom,
                  }}
                  >
                    <View style={{
                    width: 71 * scaleZoom,
                    height: 71 * scaleZoom,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                    >
                      <Image
                          source={Assets.ico_phone3}
                          style={{
                            width: 45 * scaleZoom,
                            height: 45 * scaleZoom,
                          }}
                      />
                    </View>
                    <Text style={{
                      fontSize: 12 * scaleZoom,
                      color: '#fff',
                      opacity: 0.6,
                      paddingHorizontal: 11 * scaleZoom,
                    }}
                    >
                      {torchModeType === ScanPage.TORCH_MODE_TYPE.COLLECT ? '手机号收卡' : '手机号充卡'}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.switchTorchMode}>
                  <View style={{
                    alignItems: 'center',
                    marginRight: 22 * scaleZoom,
                  }}
                  >
                    <View style={{
                      width: 71 * scaleZoom,
                      height: 71 * scaleZoom,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    >
                      {this.renderSwitchTorchMode()}
                    </View>
                    <Text style={{
                      fontSize: 12 * scaleZoom,
                      color: '#fff',
                      opacity: 0.6,
                      paddingHorizontal: 11 * scaleZoom,
                    }}
                    >
                      {'开启手电筒'}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
          )}
            onScanResultReceived={this.barcodeReceived}
        />
      </View>
    );
  }
}

export default ScanPage;
