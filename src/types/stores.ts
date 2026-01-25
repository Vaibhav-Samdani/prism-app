export interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
  userName: string;
}

export interface UserStore extends UserInfo {
  setUserInfo: (user: UserInfo) => void;
  clearUser: () => void;
}
