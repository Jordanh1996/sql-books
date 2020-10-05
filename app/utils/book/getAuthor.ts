export const getAuthor = (content: string): string => {
  const delimiter = 'Author: ';
  const regexp = new RegExp(delimiter + '.*');
  const match = content.match(regexp);
  if (match) {
    return match[0].replace(delimiter, '');
  } else return '';
};
