import { Box } from '@mui/material';
import React from 'react';
import { WordsTable } from './parts/WordsTable';
import { CSVManager } from './parts/CSVManager';
import { PlayManager } from './parts/PlayManager';
import { AllMethods } from './parts/AllMethods';
import { AddOne } from './parts/AddOne';
import { SelectedMethods } from './parts/SelectedMethods';
import { CurrentPresenter } from './parts/CurrentPresenter';

export const Words: React.FC = () => (
  <>
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <AddOne />
      <AllMethods />
      <CSVManager />
      <PlayManager />
      <SelectedMethods />
    </Box>
    <CurrentPresenter />
    <WordsTable />
  </>
);
