export const getReleaseDate = (content: string): Date => {
  const regexp = /(Release|Posting) Date: .*\[/;
  const match = content.match(regexp);
  if (match) {
    return new Date(match[0].split(':')[1].slice(0, -1));
  } else return new Date();
};
