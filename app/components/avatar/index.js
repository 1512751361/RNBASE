/**
 * 创建时间：2018/7/5
 * 描述：头像
 * */
import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Assets from './assets';
import { scaleZoom } from '../constants';

const styles = StyleSheet.create({
  hl_shadow: {
    elevation: 2,
    shadowColor: 'rgba(17,73,108,0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5 * scaleZoom,
    shadowOpacity: 0.9,
  },
});

export default class RNAvatar extends PureComponent {
    static displayName = 'RNAvatar'

    static propTypes = {
      width: PropTypes.number,
      height: PropTypes.number,
      borderRadius: PropTypes.number,
    }

    static defaultProps = {
      width: 0,
      height: 0,
      borderRadius: 0,
    }

    componentDidMount() {

    }

    render() {
      const {
        style,
        borderRadius,
        width,
        height,

        imgStyle,
        source,
        imgUrl,
      } = this.props;
      let uri = source;
      if (!uri && imgUrl) {
        uri = { uri: imgUrl };
      }
      if (!uri) {
        uri = Assets.ico_touxiang;
      }
      const borderRadius1 = borderRadius !== undefined && borderRadius ? (borderRadius + 1 * scaleZoom) : (width / 2 + 1 * scaleZoom);
      const borderRadius2 = borderRadius !== undefined && borderRadius ? borderRadius : width / 2;
      return (
        <View style={[styles.hl_shadow, {
          width: width + 2 * scaleZoom,
          height: height + 2 * scaleZoom,
          borderRadius: borderRadius1,
          alignItems: 'center',
          justifyContent: 'center',
        }, style]}
        >
          <Image
              source={uri}
              defaultSource={Assets.ico_touxiang}
              width={width}
              height={height}
              // resizeMode="cover"
              style={[{
              borderRadius: borderRadius2,
              borderWidth: 1 * scaleZoom,
              borderColor: '#fff',
            }, imgStyle]}
          />
        </View>
      );
    }
}
