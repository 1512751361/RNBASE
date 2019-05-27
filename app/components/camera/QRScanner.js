/**
 * Created by marno on 2017/4/13
 * Function: 二维码扫描界面
 * Desc:
 */
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import RNCamera from './Camera';

import { scaleZoom } from '../constants';

/**
 * 扫描界面遮罩
 * 单独写一个类，方便拷贝使用
 */
class QRScannerRectView extends Component {
    static defaultProps = {
      maskColor: '#0000004D',
      cornerColor: '#22ff00',
      borderColor: '#000000',
      rectHeight: 200 * scaleZoom,
      rectWidth: 200 * scaleZoom,
      borderWidth: 0,
      cornerBorderWidth: 4 * scaleZoom,
      cornerBorderLength: 20 * scaleZoom,
      isLoading: false,
      cornerOffsetSize: 0,
      isCornerOffset: false,
      bottomMenuHeight: 0,
      scanBarAnimateTime: 2500,
      scanBarColor: '#22ff00',
      scanBarImage: null,
      scanBarHeight: 1.5,
      scanBarOffsetY: 0,
      scanBarMargin: 6 * scaleZoom,
      hintText: '将二维码/条码放入框内，即可自动扫描',
      hintTextStyle: { color: '#fff', fontSize: 14 * scaleZoom, backgroundColor: 'transparent' },
      hintTextPosition: 130 * scaleZoom,
      isShowScanBar: true,
    };

    constructor(props) {
      super(props);
      this.animatedTiming = null;
      this.getBackgroundColor = this.getBackgroundColor.bind(this);
      this.getRectSize = this.getRectSize.bind(this);
      this.getCornerSize = this.getCornerSize.bind(this);
      this.renderLoadingIndicator = this.renderLoadingIndicator.bind(this);

      this.state = {
        topWidth: 0,
        topHeight: 0,
        leftWidth: 0,
        totalHeight: 0,
        animatedValue: new Animated.Value(0),
      };
    }

    // 获取背景颜色
    getBackgroundColor() {
      return ({
        backgroundColor: this.props.maskColor,
      });
    }

    // 获取扫描框背景大小
    getRectSize() {
      return ({
        height: this.props.rectHeight,
        width: this.props.rectWidth,
      });
    }

    // 获取扫描框边框大小
    getBorderSize() {
      if (this.props.isCornerOffset) {
        return ({
          height: this.props.rectHeight,
          width: this.props.rectWidth,
        });
        return ({
          height: this.props.rectHeight - this.props.cornerOffsetSize * 2,
          width: this.props.rectWidth - this.props.cornerOffsetSize * 2,
        });
      }
      return ({
        height: this.props.rectHeight,
        width: this.props.rectWidth,
      });
    }

    // 获取扫描框转角的颜色
    getCornerColor() {
      return ({
        borderColor: this.props.cornerColor,
      });
    }

    // 获取扫描框转角的大小
    getCornerSize() {
      return ({
        height: this.props.cornerBorderLength,
        width: this.props.cornerBorderLength,
      });
    }

    // 获取扫描框大小
    getBorderWidth() {
      return ({
        borderWidth: this.props.borderWidth ? this.props.borderWidth : this.props.cornerOffsetSize,
      });
    }

    // 获取扫描框颜色
    getBorderColor() {
      return ({
        borderColor: this.props.borderColor,
      });
    }

    // 渲染加载动画
    renderLoadingIndicator() {
      if (!this.props.isLoading) {
        return null;
      }

      return (
        <ActivityIndicator
            animating={this.props.isLoading}
            color={this.props.color}
            size="large"
        />
      );
    }

    // 测量整个扫描组件的大小
    measureTotalSize(e) {
      const totalSize = e.layout;
      this.setState({
        topWidth: totalSize.width,
        totalHeight: totalSize.height,
      });
    }

    // 测量扫描框的位置
    measureRectPosition(e) {
      const rectSize = e.layout;
      this.setState({
        topHeight: rectSize.y,
        leftWidth: rectSize.x,
      });
    }

    // 获取顶部遮罩高度
    getTopMaskHeight() {
      if (this.props.isCornerOffset) {
        return this.state.topHeight + this.props.rectHeight - this.props.cornerOffsetSize;
      }
      return this.state.topHeight + this.props.rectHeight;
    }

    // 获取底部遮罩高度
    getBottomMaskHeight() {
      if (this.props.isCornerOffset) {
        return this.props.rectHeight + this.state.topHeight - this.props.cornerOffsetSize;
      }
      return this.state.topHeight + this.props.rectHeight;
    }

    // 获取左右两边遮罩高度
    getSideMaskHeight() {
      if (this.props.isCornerOffset) {
        return this.props.rectHeight - this.props.cornerOffsetSize * 2;
      }
      return this.props.rectHeight;
    }

    // 获取左右两边遮罩宽度
    getSideMaskWidth() {
      if (this.props.isCornerOffset) {
        return this.state.leftWidth + this.props.cornerOffsetSize;
      }
      return this.state.leftWidth;
    }

    getBottomMenuHeight() {
      return ({
        bottom: this.props.bottomMenuHeight,
      });
    }

    getScanBarMargin() {
      return ({
        marginRight: this.props.scanBarMargin,
        marginLeft: this.props.scanBarMargin,
      });
    }

    getScanImageWidth() {
      if (this.props.isCornerOffset) {
        return ({
          height: this.props.rectHeight - this.props.cornerOffsetSize * 2 - this.props.scanBarMargin * 2,
          width: this.props.rectWidth - this.props.cornerOffsetSize * 2 - this.props.scanBarMargin * 2,
        });
      }
      return ({
        height: this.props.rectHeight - this.props.scanBarMargin * 2,
        width: this.props.rectWidth - this.props.scanBarMargin * 2,
      });
    }

    // 绘制扫描线
    _renderScanBar() {
      const {
        width,
        height,
      } = this.getScanImageWidth();
      if (!this.props.isShowScanBar) return;
      if (this.props.scanBarImage) {
        return (
          <Image
              style={[{ resizeMode: 'contain', width }, this.props.scanBarImageStyle]}
              source={this.props.scanBarImage}
          />
        );
      }
      return (
        <View style={[this.getScanBarMargin(), {
          backgroundColor: this.props.scanBarColor,
          height,
        }]}
        />
      );
    }

    render() {
      const animatedStyle = {
        transform: [
          { translateY: this.state.animatedValue },
        ],
      };

      return (
        <View
            onLayout={({ nativeEvent: e }) => this.measureTotalSize(e)}
            style={[styles.container, this.getBottomMenuHeight()]}
        >
          <View style={[
            this.getBackgroundColor(),
            // styles.topMask,
            {
              // bottom: this.getTopMaskHeight(),
              // width: this.state.topWidth,
              // height: this.state.topHeight+this.props.cornerBorderWidth,
              flex: 1,
              position: 'relative',
            },
          ]}
          />
          <View style={[this.getBackgroundColor(), {
            height: this.props.bottomMenuHeight,
            flex: 1,
            position: 'relative',
          }]}
          />
          <View style={{
            position: 'relative',
            flexDirection: 'row',
          }}
          >
            <View style={[
              this.getBackgroundColor(),
              // styles.leftMask,
              {
                // height: this.getSideMaskHeight(),
                // width: this.getSideMaskWidth(),
                flex: 1,
                position: 'relative',
              },
            ]}
            />
            <View
                style={[styles.viewfinder, { zIndex: 10, position: 'relative' }, this.getRectSize()]}
                onLayout={({ nativeEvent: e }) => this.measureRectPosition(e)}
            >

              {/* 扫描框边线 */}
              <View style={[
                this.getBorderSize(),
                this.getBorderColor(),
                this.getBorderWidth(),
                { overflow: 'hidden' },
              ]}
              >

                <Animated.View
                    style={[
                    animatedStyle, this.props.scanBarImage ? { alignItems: 'center' } : {}]}
                >
                  {this._renderScanBar()}
                </Animated.View>

              </View>

              {/* 扫描框转角-左上角 */}
              <View style={[
                this.getCornerColor(),
                this.getCornerSize(),
                styles.topLeftCorner,
                {
                  borderLeftWidth: this.props.cornerBorderWidth,
                  borderTopWidth: this.props.cornerBorderWidth,
                },
              ]}
              />

              {/* 扫描框转角-右上角 */}
              <View style={[
                this.getCornerColor(),
                this.getCornerSize(),
                styles.topRightCorner,
                {
                  borderRightWidth: this.props.cornerBorderWidth,
                  borderTopWidth: this.props.cornerBorderWidth,
                },
              ]}
              />

              {/* 加载动画 */}
              {this.renderLoadingIndicator()}

              {/* 扫描框转角-左下角 */}
              <View style={[
                this.getCornerColor(),
                this.getCornerSize(),
                styles.bottomLeftCorner,
                {
                  borderLeftWidth: this.props.cornerBorderWidth,
                  borderBottomWidth: this.props.cornerBorderWidth,
                },
              ]}
              />

              {/* 扫描框转角-右下角 */}
              <View style={[
                this.getCornerColor(),
                this.getCornerSize(),
                styles.bottomRightCorner,
                {
                  borderRightWidth: this.props.cornerBorderWidth,
                  borderBottomWidth: this.props.cornerBorderWidth,
                },
              ]}
              />
            </View>
            <View style={[
              this.getBackgroundColor(),
              // styles.rightMask,
              {
                // height: this.getSideMaskHeight(),
                // width: this.getSideMaskWidth(),
                flex: 1,
                position: 'relative',
              }]}
            />
          </View>
          <View style={[
            this.getBackgroundColor(),
            // styles.bottomMask,
            {
              // top: this.getBottomMaskHeight(),
              // width: this.state.topWidth,
              // height: this.state.totalHeight - (this.state.topHeight+this.props.rectHeight)+this.props.cornerBorderWidth,
              flex: 1,
              position: 'relative',
              alignItems: 'center',
            }]}
          >
            <View style={{ position: 'absolute', bottom: this.props.hintTextPosition - this.props.bottomMenuHeight / 2 }}>
              {/* <View style={{position: 'absolute', bottom: 0}}> */}
              <Text style={this.props.hintTextStyle}>{this.props.hintText}</Text>
            </View>
          </View>

        </View>
      );
    }

    componentDidMount() {
      this.scannerLineMove();
    }

    scannerLineMove() {
      this.state.animatedValue.setValue(this.props.scanBarOffsetY / 2); // 重置Rotate动画值为0
      this.animatedTiming = Animated.timing(this.state.animatedValue, {
        toValue: this.props.rectHeight + this.props.scanBarOffsetY,
        duration: this.props.scanBarAnimateTime,
        easing: Easing.linear,
      }).start(() => this.scannerLineMove());
    }

    componentWillUnmount() {
      if (this.animatedTiming) {
        this.animatedTiming.stop();
      }
    }
}

/**
 * 扫描界面
 */
export default class QRScannerView extends Component {
    static propTypes = {
      maskColor: PropTypes.string,
      borderColor: PropTypes.string,
      cornerColor: PropTypes.string,
      borderWidth: PropTypes.number,
      cornerBorderWidth: PropTypes.number,
      cornerBorderLength: PropTypes.number,
      rectHeight: PropTypes.number,
      rectWidth: PropTypes.number,
      isLoading: PropTypes.bool,
      isCornerOffset: PropTypes.bool, // 边角是否偏移
      cornerOffsetSize: PropTypes.number,
      bottomMenuHeight: PropTypes.number,
      scanBarAnimateTime: PropTypes.number,
      scanBarColor: PropTypes.string,
      scanBarImage: PropTypes.any,
      scanBarOffsetY: PropTypes.number,
      scanBarHeight: PropTypes.number,
      scanBarMargin: PropTypes.number,
      hintText: PropTypes.string,
      hintTextStyle: PropTypes.object,
      hintTextPosition: PropTypes.number,
      renderTopBarView: PropTypes.func,
      renderBottomMenuView: PropTypes.func,
      isShowScanBar: PropTypes.bool,
      bottomMenuStyle: PropTypes.object,
      torchMode: PropTypes.string,
    };

    static defaultProps = {
      torchMode: 'auto',
    }

    constructor(props) {
      super(props);
      // 通过这句代码屏蔽 YellowBox
      console.disableYellowBox = true;
    }

    render() {
      const { torchMode } = this.props;
      return (
        <View style={{ flex: 1 }}>
          <RNCamera
              onBarCodeRead={this.props.onScanResultReceived}
            // torchMode={RNCamera.Constants.TorchMode[torchMode]}
              style={{ flex: 1 }}
          >
            {/* 绘制顶部标题栏组件 */}
            {this.props.renderTopBarView()}

            {/* 绘制扫描遮罩 */}
            <QRScannerRectView
                maskColor={this.props.maskColor}
                cornerColor={this.props.cornerColor}
                borderColor={this.props.borderColor}
                rectHeight={this.props.rectHeight}
                rectWidth={this.props.rectWidth}
                borderWidth={this.props.borderWidth}
                cornerBorderWidth={this.props.cornerBorderWidth}
                cornerBorderLength={this.props.cornerBorderLength}
                isLoading={this.props.isLoading}
                cornerOffsetSize={this.props.cornerOffsetSize}
                isCornerOffset={this.props.isCornerOffset}
                bottomMenuHeight={this.props.bottomMenuHeight}
                scanBarAnimateTime={this.props.scanBarAnimateTime}
                scanBarColor={this.props.scanBarColor}
                scanBarHeight={this.props.scanBarHeight}
                scanBarMargin={this.props.scanBarMargin}
                hintText={this.props.hintText}
                hintTextStyle={this.props.hintTextStyle}
                scanBarImage={this.props.scanBarImage}
                scanBarOffsetY={this.props.scanBarOffsetY}
                hintTextPosition={this.props.hintTextPosition}
                isShowScanBar={this.props.isShowScanBar}
                scanBarImageStyle={this.props.scanBarImageStyle}
            />

            {/* 绘制底部操作栏 */}
            <View style={[styles.buttonsContainer, this.props.bottomMenuStyle]}>
              {this.props.renderBottomMenuView()}
            </View>
          </RNCamera>
        </View>
      );
    }
}


const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    // flex: 1
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  topMask: {
    position: 'absolute',
    top: 0,
  },
  leftMask: {
    position: 'absolute',
    left: 0,
  },
  rightMask: {
    position: 'absolute',
    right: 0,
  },
  bottomMask: {
    position: 'absolute',
    bottom: 0,
  },
});
