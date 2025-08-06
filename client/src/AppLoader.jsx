import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyChannel } from './features/channel/channelSlice.js';

export default function AppLoader() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchMyChannel());
    }
  }, [dispatch, userInfo]);

  return null;
}
