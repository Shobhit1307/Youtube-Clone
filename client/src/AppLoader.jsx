import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyChannel } from './features/channel/channelSlice.js';
import { logout } from './features/user/userSlice.js';
import jwtDecode from './utils/jwtDecode.js';

export default function AppLoader() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    if (userInfo?.token) {
      // Check token expiry and logout if expired
      const decoded = jwtDecode(userInfo.token);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        dispatch(logout());
      } else {
        dispatch(fetchMyChannel());
      }
    }
  }, [dispatch, userInfo]);

  return null;
}
