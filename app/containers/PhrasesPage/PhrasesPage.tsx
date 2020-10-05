import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import styles from './PhrasesPage.css';
import { PhraseList } from '../../components/phrases/phrase-list/PhraseList';
import { Phrase } from '../../db/tables/phrase/phrase.interface';
import {
  selectPhrases,
  findPhrase,
  PhraseMatch,
} from '../../db/tables/phrase/queries/select-phrases';
import { deletePhrase } from '../../db/tables/phrase/queries/delete-phrase';
import { PhraseForm } from '../../components/phrases/phrase-form/PhraseForm';
import { MatchTable } from '../../components/phrases/match-table/MatchTable';

export const PhrasesPage = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [lastFilter, setLastFilter] = useState<unknown>({});
  const [matches, setMatches] = useState<PhraseMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const onSearchClick = useCallback(async (phrase: Phrase) => {
    const matches = await findPhrase(phrase.phrase_id);
    setMatches(matches);
  }, []);

  const getPhrases = useCallback(
    async (options: any = {}) => {
      setLastFilter(options);
      setLoading(true);
      const phrases = await selectPhrases(options);
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
