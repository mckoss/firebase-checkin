// Firebase data model - see also checkin.bolt

export interface Event {
  title: string;
  owner: string;
}

export interface User {
  email: string;
  displayName: string;
  photoURL: string;
}
