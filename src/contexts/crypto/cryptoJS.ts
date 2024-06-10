import CryptoJS from 'crypto-js';
import {Profile} from '../AuthContext'

export const encryptProfile = (profile: Profile): string => {
  const encryptedProfile = CryptoJS.AES.encrypt(JSON.stringify(profile), 'secret-key').toString();
  return encryptedProfile;
};

export const decryptProfile = (encryptedProfile: string): Profile => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedProfile, 'secret-key');
  const decryptedProfile = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  return decryptedProfile;
};
