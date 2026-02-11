export const getUrlFromRow = (row: { platform: string; value: string }) => {
  const val = row.value.trim().replace('@', '');
  if (val.startsWith('http')) return val;

  switch (row.platform) {
    case 'instagram':
      return `https://www.instagram.com/${val}/`;
    case 'tiktok':
      return `https://www.tiktok.com/@${val}`;
    case 'youtube':
      return `https://www.youtube.com/@${val}`;
    default:
      return val;
  }
};
