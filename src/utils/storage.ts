import { BPRecord, UserProfile } from '../types';

const RECORDS_KEY = 'bp_records';
const PROFILE_KEY = 'bp_profile';

export function saveRecords(records: BPRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records:', e);
  }
}

export function loadRecords(): BPRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY);
    if (data) {
      return JSON.parse(data) as BPRecord[];
    }
  } catch (e) {
    console.error('Failed to load records:', e);
  }
  return [];
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      return JSON.parse(data) as UserProfile;
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }
  return { name: '', age: 0, gender: '' };
}
