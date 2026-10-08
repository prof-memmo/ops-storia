export const getAssetPath = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const getPawnImg = (id: number | string): string => {
  return getAssetPath(`/images/pedine_page_${id}.png`);
};
