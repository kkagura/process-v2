export const removeItem = <T>(arr: T[], item: T) => {
  const i = arr.indexOf(item);
  if (i > -1) arr.splice(i, 1);
};

export const removeItemByFilter = <T>(
  arr: T[],
  filter: (value: T, index: number, obj: T[]) => unknown
) => {
  const i = arr.findIndex(filter);
  if (i > -1) arr.splice(i, 1);
};
