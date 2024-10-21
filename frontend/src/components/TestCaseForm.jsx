import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const TestCaseForm = ({ onSubmit }) => {
  const [testCase, setTestCase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(JSON.parse(testCase));
    setTestCase('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Test Case (JSON)"
        value={testCase}
        onChange={(e) => setTestCase(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Add Test Case
      </Button>
    </form>
  );
};

export default TestCaseForm;