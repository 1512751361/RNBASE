import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';

import RNTouchableOpacity from '../button/TouchableOpacity';
import RNRootSiblings from '../rootSiblings';

const scaleZoom = 2;

class Confirm extends PureComponent {
  constructor(props) {
    super(props);
    this.onClosePress = this.onClosePress.bind(this);
    this.btnRender = this.btnRender.bind(this);
  }

  onClosePress = () => {
    const {
      onDestroyPress,
    } = this.props;
    if (onDestroyPress) onDestroyPress();
  }

  btnRender = () => {
    const {
      buttons,
      label,
    } = this.props;
    let box = [];
    if (buttons && Object.prototype.toString.call(buttons) === '[object Array]' && buttons.length > 0) {
      const len = buttons.length;
      box = buttons.map((item, index) => {
        if (item) {
          const {
            onPress,
            text,
            style,
          } = item;
          let color = '#333';
          if (style === 'cancel') {
            color = '#EE4970';
          } else if (style === 'blue') {
            color = '#416DD8';
          }
          return (
            <RNTouchableOpacity
                key={index}
                style={{
                flex: 1,
                height: 45 * scaleZoom,
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: index === len - 1 ? 0 : 1,
                borderRightColor: '#D8D8D8',
              }}
                onPress={() => {
                if (onPress) {
                  onPress(item, index);
                  this.onClosePress();
                } else {
                  this.onClosePress();
                }
              }}
            >
              <Text style={{
                color,
                textAlign: 'center',
                fontSize: 17 * scaleZoom,
              }}
              >
                {text}
              </Text>
            </RNTouchableOpacity>
          );
        }
        return null;
      });
    } else {
      return (
        <RNTouchableOpacity
            style={{
            flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 * scaleZoom,
          }}
            onPress={this.onClosePress}
        >
          <Text style={{
            color: '#416DD8',
            textAlign: 'center',
            fontSize: 17 * scaleZoom,
          }}
          >
            {label || '知道了'}
          </Text>
        </RNTouchableOpacity>
      );
    }
    return box;
  }

  render() {
    const {
      title,
      content,
    } = this.props;
    const w = 540 / 2 * scaleZoom;
    const h = 320 / 2 * scaleZoom;
    return (
      <View
          style={[{
          backgroundColor: '#fff',
          width: w,
          mineHeight: h,
          borderRadius: 12 * scaleZoom,
          position: 'relative',
        }]}
      >
        <View>
          <Text style={{
            fontSize: 17 * scaleZoom,
            color: '#333333',
            textAlign: 'center',
            paddingVertical: 20 * scaleZoom,
            fontWeight: '500',
          }}
          >
            {title}
          </Text>
          <Text style={{
            fontSize: 12 * scaleZoom,
            color: '#333333',
            textAlign: 'center',
            letterSpacing: 0.74,
            lineHeight: 18 * scaleZoom,
            paddingBottom: 20 * scaleZoom,
            paddingHorizontal: 20 * scaleZoom,
            flexWrap: 'wrap',
          }}
          >
            {content}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ height: 1, backgroundColor: '#D8D8D8' }} />
        <View style={[{
          height: 45 * scaleZoom,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }]}
        >
          {this.btnRender()}
        </View>
      </View>
    );
  }
}

class ConfirmAlert extends PureComponent {
  constructor(props) {
    super(props);
    this.alert = this.alert.bind(this);
  }

  alert = (title, content, buttons, options) => {
    RNRootSiblings.show(<Confirm title={title} content={content} buttons={buttons} options={options} />, options);
  }

  render() {
    return null;
  }
}

export default new ConfirmAlert();
