import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'scottyapp-storage',
  encryptionKey: 'scottyapp-mmkv-key-v1',
});

export const sessionStorage = new MMKV({
  id: 'scottyapp-session',
});
