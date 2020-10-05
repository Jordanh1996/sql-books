export const getTitle = (content: string): string => {
  const delimiter = 'Title: ';
  const regexp = new RegExp(delimiter + '.*');
  const match = content.match(regexp);
  if (match) {
    return match[0].replace(delimiter, '');
  } else return '';
};
