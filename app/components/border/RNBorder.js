/**
 * 创建时间：2018/7/5
 * 描述：边框
 * */
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  BorderShadow,
} from 'react-native-shadow';
import { scaleZoom } from '../constants';

export default class RNBorder extends Component {
  static propTypes = {
    type: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    shadow: PropTypes.string,
    side: PropTypes.string,
    inset: PropTypes.bool,
    borderWidth: PropTypes.number,
    borderColor: PropTypes.string,
    borderTopWidth: PropTypes.number,
    borderTopColor: PropTypes.string,
    borderBottomWidth: PropTypes.number,
    borderBottomColor: PropTypes.string,
    borderLeftWidth: PropTypes.number,
    borderLeftColor: PropTypes.string,
    borderRightWidth: PropTypes.number,
    borderRightColor: PropTypes.string,
  }

  static defaultProps = {
    type: '',
    width: 0,
    height: 0,
    shadow: '#5f5e5e',
    side: 'top',
    inset: true,
    borderWidth: 0,
    borderColor: '#000',
    borderTopWidth: 0,
    borderTopColor: '',
    borderBottomWidth: 0,
    borderBottomColor: '',
    borderLeftWidth: 0,
    borderLeftColor: '',
    borderRightWidth: 0,
    borderRightColor: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.renderSolid = this.renderSolid.bind(this);
    this.getBorder = this.getBorder.bind(this);
    this.borderRender = this.borderRender.bind(this);
    this.dashed = this.dashed.bind(this);
    this.dotted = this.dotted.bind(this);
    this.renderBorderShadow = this.renderBorderShadow.bind(this);
  }

  renderSolid = () => {
    const {
      borderWidth,
      borderColor,
      borderTopWidth,
      borderTopColor,
      borderBottomWidth,
      borderBottomColor,
      borderLeftWidth,
      borderLeftColor,
      borderRightWidth,
      borderRightColor,
      type,
      style,
      children,
    } = this.props;
    return (
      <View style={[{
        borderWidth,
        borderColor,
        borderTopWidth,
        borderTopColor,
        borderBottomWidth,
        borderBottomColor,
        borderLeftWidth,
        borderLeftColor,
        borderRightWidth,
        borderRightColor,
      }, style]}
      >
        {children}
      </View>
    );
  }

  getBorder = (renderBorder, payload = {}) => {
    const {
      borderWidth,
      borderColor,
      borderTopWidth,
      borderTopColor,
      borderBottomWidth,
      borderBottomColor,
      borderLeftWidth,
      borderLeftColor,
      borderRightWidth,
      borderRightColor,
      type,
    } = this.props;
    const {
      width,
      height,
    } = this.state;
    let {
      spacing,
      BLH,
      BTW,
      BRH,
      BBW,
    } = payload;
    spacing = spacing || 0;
    const border = {};
    // left
    const leftW = borderLeftWidth || borderWidth;
    const leftC = borderLeftColor || borderColor;
    BLH = BLH || leftW;
    if (leftW) {
      const leftL = parseInt(height / (BLH + spacing), 10);
      border.left = [];
      for (let i = 0; i < leftL; i += 1) {
        border.left.push(renderBorder(leftW, BLH, leftC, `left${i}`));
      }
    }
    // top
    const topW = borderTopWidth || borderWidth;
    const topC = borderTopColor || borderColor;
    BTW = BTW || topW;
    if (topW) {
      const topL = parseInt(width / (BTW + spacing), 10);
      border.top = [];
      for (let i = 0; i < topL; i += 1) {
        border.top.push(renderBorder(BTW, topW, topC, `top${i}`));
      }
    }
    // right
    const rightW = borderRightWidth || borderWidth;
    const rightC = borderRightColor || borderColor;
    BRH = BRH || rightW;
    if (rightW) {
      const rightL = parseInt(height / (BRH + spacing), 10);
      border.right = [];
      for (let i = 0; i < rightL; i += 1) {
        border.right.push(renderBorder(rightW, BRH, rightC, `right${i}`));
      }
    }

    // bottom
    const bottomW = borderBottomWidth || borderWidth;
    const bottomC = borderBottomColor || borderColor;
    BBW = BBW || bottomW;
    if (bottomW) {
      const bottomL = parseInt(width / (BBW + spacing), 10);
      border.bottom = [];
      for (let i = 0; i < bottomL; i += 1) {
        border.bottom.push(renderBorder(BBW, bottomW, bottomC, `bottom${i}`));
      }
    }

    return border;
  }

  borderRender = () => {
    const {
      style,
      type,
      children,
    } = this.props;
    let getBorder = {};
    switch (type) {
      case 'dotted':
        getBorder = this.dotted();
        break;
      case 'dashed':
        getBorder = this.dashed();
        break;
      default:
    }
    return (
      <View
          style={{
          flex: 1,
          borderRadius: 20 * scaleZoom,
        }}
          onLayout={(event) => {
          const {
            x, y, width, height,
          } = event.nativeEvent.layout;
          this.setState({
            width,
            height,
          });
        }}
      >
        {getBorder.top ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          >
            {getBorder.top}
          </View>
        ) : null}
        <View style={{
          flex: 1,
          flexDirection: 'row',
        }}
        >
          {getBorder.left ? (
            <View style={{
              justifyContent: 'space-between',
            }}
            >
              {getBorder.left}
            </View>
          ) : null}
          <View style={[{ flex: 1 }, style]}>{children}</View>
          {getBorder.right ? (
            <View style={{
              justifyContent: 'space-between',
            }}
            >
              {getBorder.right}
            </View>
          ) : null}
        </View>
        {getBorder.bottom ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          >
            {getBorder.bottom}
          </View>
        ) : null}
      </View>
    );
  }

  dashed = () => this.getBorder((w, h, c, key) => (
    <View
        key={key}
        style={{
        backgroundColor: c,
        width: w,
        height: h,
      }}
    />
  ), {
    spacing: 3 * scaleZoom, BLH: 4 * scaleZoom, BTW: 4 * scaleZoom, BRH: 4 * scaleZoom, BBW: 4 * scaleZoom,
  })

  dotted = () => this.getBorder((w, h, c, key) => (
    <View
        key={key}
        style={{
        backgroundColor: c,
        width: w,
        height: h,
        borderRadius: w / 2,
      }}
    />
  ), { spacing: 2 * scaleZoom })

  renderBorderShadow = () => {
    const {
      borderShadow,
      shadow,
      height,
      width,
      side,
      inset,
      style,
    } = this.props;
    return (
      <View style={[{ height }, style]}>
        <BorderShadow
            setting={{
            color: shadow,
            width,
            border: height,
            opacity: 0.2,
            side,
            inset: true,
          }}
        >
          <View />
        </BorderShadow>
      </View>
    );
  }

  render() {
    const {
      type,
    } = this.props;
    switch (type) {
      case 'solid':
        return this.renderSolid();
      case 'shadow':
        return this.renderBorderShadow();
      case 'dotted':
      case 'dashed':
        return this.borderRender();
      default:
        return null;
    }
  }
}
