import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import styles from './PhrasesPage.css';
import { PhraseList } from '../../components/phrases/phrase-list/PhraseList';
import { Phrase, PhraseWithWords } from '../../db/tables/phrase/phrase.interface';
import {
  selectPhrases,
  findPhrase,
  PhraseMatch,
} from '../../db/tables/phrase/queries/select-phrases';
import { deletePhrase } from '../../db/tables/phrase/queries/delete-phrase';
import { PhraseForm } from '../../components/phrases/phrase-form/PhraseForm';
import { MatchTable } from '../../components/phrases/match-table/MatchTable';
import { Filter } from '../../components/phrases/phrase-filter/PhraseFilter';

export const PhrasesPage = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [lastFilter, setLastFilter] = useState<Filter>({ phrase: '' });
  const [matches, setMatches] = useState<(PhraseMatch & { phrase: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const onSearchClick = useCallback(async (phrase: PhraseWithWords) => {
    const matches = await findPhrase(phrase.phrase_id);

    setMatches(matches.map(match => ({ ...match, phrase: phrase.phrase })));
  }, []);

  const getPhrases = useCallback(
    async (options: Filter = { phrase: '' }) => {
      setLastFilter(options);
      setLoading(true);
      let phrases = await selectPhrases();
      if (options.phrase) {
        phrases = phrases.filter(phrase => phrase.phrase.includes(options.phrase));
      }
      setPhrases(phrases);
      setLoading(false);
    },
    [setLoading, setPhrases]
  );

  const removePhrase = useCallback(
    (phrase: Phrase) => {
      deletePhrase(phrase.phrase_id);
      setPhrases(phrases.filter((cur) => cur.phrase_id !== phrase.phrase_id));
    },
    [setPhrases, phrases]
  );

  useEffect(() => {
    getPhrases();
  }, []);

  return (
    <div className={clsx('column', 'full-page-height')}>
      <div className={clsx('justify-center', styles.formWrapper)}>
        <PhraseForm onAddPhrase={() => getPhrases(lastFilter)} />
      </div>
      <PhraseList
        phrases={phrases}
        loading={loading}
        getPhrases={getPhrases}
        onSearchClick={onSearchClick}
        removePhrase={removePhrase}
      />
      <div className={styles.matchTableWrapper}>
        <MatchTable matches={matches} />
      </div>
    </div>
  );
};
