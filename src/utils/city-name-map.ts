export const cityNameMap: { [citySpelling: string]: string } = {
  luoyang: '洛阳',
  zhengzhou: '郑州',
};

export const getCityNameBySpelling = (
  citySpelling: string | null | undefined,
) => {
  if (!citySpelling) return citySpelling;
  return cityNameMap[citySpelling] || citySpelling;
};
