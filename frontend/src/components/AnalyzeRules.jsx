import React from 'react';
import { Button } from '@material-ui/core';

const AnalyzeRules = ({ onCombine, onAnalyze }) => {
  return (
    <div>
      <Button onClick={onCombine} variant="contained" color="primary">
        Combine Selected Rules
      </Button>
      <Button onClick={onAnalyze} variant="contained" color="secondary">
        Analyze Test Cases
      </Button>
    </div>
  );
};

export default AnalyzeRules;