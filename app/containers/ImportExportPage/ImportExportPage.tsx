import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import styles from './ImportExportPage.css';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { exportDB } from '../../db/export/export-db';
import { ipcRenderer, OpenDialogReturnValue, SaveDialogReturnValue } from 'electron';
import { importDB } from '../../db/export/import-db';
import { dropTables } from '../../db/tables/drop-tables';
import { createTables } from '../../db/tables/create-tables';

const getExportPath = (): Promise<SaveDialogReturnValue> => {
  return new Promise((resolve) => {
    const listener = (event, arg: SaveDialogReturnValue) => {
      resolve(arg);
      ipcRenderer.removeListener('get-export-path', listener);
    };
    ipcRenderer.on('get-export-path', listener);
    ipcRenderer.send('get-export-path');
  });
}

const getImportPath = (): Promise<OpenDialogReturnValue> => {
  return new Promise((resolve) => {
    const listener = (event, arg: OpenDialogReturnValue) => {
      resolve(arg);
      ipcRenderer.removeListener('get-import-path', listener);
    };
    ipcRenderer.on('get-import-path', listener);
    ipcRenderer.send('get-import-path');
  });
}

export const ImportExportPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const onExportDB = useCallback(async () => {
    try {
      const { canceled, filePath } = await getExportPath();
      if (canceled) return;
      setLoading(true);
      await exportDB(filePath);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const onImportDB = useCallback(async () => {
    try {
      const { canceled, filePaths } = await getImportPath();
      if (canceled) return;
      const [filePath] = filePaths;
      setLoading(true);
      await dropTables();
      await createTables();
      await importDB(filePath);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div className={clsx('column', 'full-page-height')}>
      <Paper className={styles.importExportBoxContainer}>
        <h2 className={styles.title}>Import / Export</h2>
        <div className={styles.buttonsContainer}>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              disabled={loading}
              onClick={onExportDB}
            >
              Export DB
              {loading && (
                <CircularProgress size={24} className={styles.submitProgress} />
              )}
            </Button>
          </div>
            
          <div>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              disabled={loading}
              onClick={onImportDB}
            >
              Import DB
              {loading && (
                <CircularProgress size={24} className={styles.submitProgress} />
              )}
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};
