import React, { useEffect, useReducer } from 'react';
import styles from './import.css';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const steps = [
  'Preparing to import data',
  'Importing words',
  'Importing books',
  'Importing groups',
  'Importing phrases',
];

enum Actions {
  RUNNING = 'RUNNING',
  PROGRESS = 'PROGRESS',
  CLEAR = 'CLEAR',
}

interface Step {
  step: number;
  progress: number;
}

interface StepperState {
  steps: Array<Step>;
  currentStep: number;
  running: boolean;
}

type Action =
  | { type: Actions.RUNNING; payload: boolean }
  | { type: Actions.PROGRESS; payload: Step }
  | { type: Actions.CLEAR };

const initialState = {
  steps: steps.map((_, i) => ({ step: i, progress: 0 })),
  currentStep: 0,
  running: false,
};

const reducer = (state: StepperState, action: Action): StepperState => {
  switch (action.type) {
    case Actions.RUNNING:
      return { ...state, running: action.payload };
    case Actions.PROGRESS:
      const newSteps = [...state.steps];
      newSteps[action.payload.step] = action.payload;
      if (action.payload.step === state.currentStep && action.payload.progress === 100) {
        return { ...state, steps: newSteps, currentStep: state.currentStep + 1 };
      }
      return { ...state, steps: newSteps };
    case Actions.CLEAR:
      return initialState;
    default:
      return state;
  }
};

export const ImportStepper = ({
  showImport,
}) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const startHandler = () => {
      console.log('start');
      dispatch({ type: Actions.CLEAR });
    };
    ipcRenderer.on('import:start', startHandler);

    const progressHandler = (e: IpcRendererEvent, step: Step) => {
      console.log(e, step);
      dispatch({ type: Actions.PROGRESS, payload: step });
    }
    ipcRenderer.on('import:progress', progressHandler);

    return () => {
      ipcRenderer.removeListener('import:start', startHandler);
      ipcRenderer.removeListener('import:progress', progressHandler);
    };
  }, []);

  if (!showImport) {
    return null;
  }

  return (
      <Stepper activeStep={data.currentStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress variant="determinate" value={data?.steps?.[index]?.progress} />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="textSecondary">{`${Math.round(
                    data?.steps?.[index]?.progress
                  )}%`}</Typography>
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
        {data.currentStep === steps.length && (
          <Paper square elevation={0} className={styles.finishedText}>
            <Typography>All steps completed - Import finished successfully</Typography>
          </Paper>
        )}
      </Stepper>
  );
};
