import {
  Platform,
} from 'react-native';
import Colors from './Colors';

import { scaleZoom as scaleZoom2 } from '../constants';

export const scaleZoom = scaleZoom2;
export const isAndroid = Platform.OS === 'android';

export const Typography = {
  text70: {
    fontSize: (isAndroid ? 16 : 17) * scaleZoom,
    fontWeight: '300',
    lineHeight: (isAndroid
      ? Math.floor(16 * 1.38)
      : Math.floor(17 * 1.29)) * scaleZoom,
    fontFamily: isAndroid ? 'sans-serif-light' : undefined,
  },
  text90: {
    fontSize: (isAndroid ? 12 : 13) * scaleZoom,
    fontWeight: '300',
    lineHeight: (isAndroid
      ? Math.floor(12 * 1.33)
      : Math.floor(13 * 1.38)) * scaleZoom,
    fontFamily: isAndroid ? 'sans-serif-light' : undefined,
  },
};

export const DEFAULT_COLOR_BY_STATE = {
  default: Colors.dark40,
  focus: Colors.blue30,
  error: Colors.red30,
};

export const DEFAULT_UNDERLINE_COLOR_BY_STATE = {
  default: Colors.dark70,
  focus: Colors.blue30,
  error: Colors.red30,
};
