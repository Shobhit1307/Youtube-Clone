export default function getAvatarUrl(avatar) {
  // If backend returns something valid (absolute or relative), use it
  if (avatar && avatar.trim()) {
    return avatar;
  }
  // Otherwise use default placeholder
  return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
}
