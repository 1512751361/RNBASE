import { Platform } from 'react-native';
import DatePickerAndroid from './DatePickerAndroid';
import DatePickerIOS from './DatePickerIOS';

const IS_ANDROID = Platform.OS === 'android';

export default (IS_ANDROID ? DatePickerAndroid : DatePickerIOS);
