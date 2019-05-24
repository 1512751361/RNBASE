import I18n, { getLanguages } from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import Storage from '../lib/Storage';
// import en from './en';
import zh from './zh';

const localLanguageKey = 'localLanguage';


I18n.defaultLocale = 'en';

I18n.fallbacks = true;

I18n.translations = {
  // en,
  zh,
};

I18n.localeLanguage = async () => {
    const res = await Storage.get(localLanguageKey);
    if (res) {
      I18n.locale = res;
    } else {
      I18n.locale = DeviceInfo.getDeviceLocale();
    }
    return I18n.locale;
};


export { I18n, getLanguages };
