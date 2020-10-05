import { Word } from '../../db/tables/word/word.interface';

export const getWords = (content: string): Omit<Word, 'book_id'>[] => {
  const lines = content.split('\n');
  const words = [];
  let offset = 0;
  let wordIndex = 1;
  let sentence = 1;
  let paragraph = 1;
  let lastEmptyLine = false;

  lines.forEach((line, lineIndex) => {
    let lineOffset = 0;

    if (!line.trim()) {
      lastEmptyLine = true;
    } else if (lastEmptyLine) {
      paragraph++;
      sentence++;
      lastEmptyLine = false;
    }

    line.split('.').forEach((linePart, linePartIndex) => {
      let sub = linePart;
      if (linePartIndex !== 0) {
        sentence++;
        lineOffset++;
      }

      while (true) {
        // const match = sub.match(/[\w]+[^\s]*[\s]/);
        const match = sub.match(/[a-zA-Z]+/);

        if (match !== null) {
          words.push({
            index: wordIndex++,
            offset: offset + lineOffset + match.index,
            word: match[0].toLowerCase(),
            sentence,
            line: lineIndex + 1,
            paragraph,
          });
          const dist = match[0].length + match.index;
          lineOffset += dist;
          sub = sub.substring(dist);
        } else break;
      }
    });

    offset += line.length + 1; // 1 for the \n that was splitted
  });

  return words;
};
