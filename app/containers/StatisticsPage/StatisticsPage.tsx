import React from 'react';
import clsx from 'clsx';
import styles from './StatisticsPage.css';
import { GeneralStatistics } from '../../components/statistics/general-statistics/GeneralStatistics';
import { BookStatistics } from '../../components/statistics/book-statistics/BookStatistics';

export const StatisticsPage = () => {
  return (
    <div className={clsx('column', 'align-center', styles.wrapper)}>
      <GeneralStatistics />
      <BookStatistics />
    </div>
  );
};
