export const getAssetPath = (path: string): string => {
  const isProd = process.env.NODE_ENV === 'production';
  const base = isProd ? '/ops-storia' : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const getPawnImg = (id: number | string): string => {
  return getAssetPath(`/images/pedine_page_${id}.png`);
};
