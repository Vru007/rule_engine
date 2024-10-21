import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';
import TestCaseForm from './components/TestCaseForm';
import AnalyzeRules from './components/AnalyzeRules';
import { createRule, evaluateRule, combineRules, getRules, deleteRule } from './services/api';

function App() {
  const [rules, setRules] = useState([]);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const fetchedRules = await getRules();
      setRules(fetchedRules.map(rule => ({ ...rule, selected: false })));
    } catch (error) {
      toast.error('Failed to fetch rules');
    }
  };

  const handleCreateRule = async (rule) => {
    try {
      await createRule(rule);
      toast.success('Rule created successfully');
      fetchRules();
    } catch (error) {
      toast.error('Failed to create rule');
    }
  };

  const handleDeleteRule = async (name) => {
    try {
      await deleteRule(name);
      toast.success('Rule deleted successfully');
      fetchRules();
    } catch (error) {
      toast.error('Failed to delete rule');
    }
  };

  const handleToggleSelect = (name) => {
    setRules(rules.map(rule => 
      rule.name === name ? { ...rule, selected: !rule.selected } : rule
    ));
  };

  const handleAddTestCase = (testCase) => {
    setTestCases([...testCases, testCase]);
  };

  const handleCombineRules = async () => {
    const selectedRules = rules.filter(rule => rule.selected);
    if (selectedRules.length < 2) {
      toast.warn('Please select at least two rules to combine');
      return;
    }
    try {
      const result = await combineRules(selectedRules.map(rule => rule.name));
      toast.success('Rules combined successfully');
      console.log('Combined AST:', result.combinedAst);
    } catch (error) {
      toast.error('Failed to combine rules');
    }
  };

  const handleAnalyzeTestCases = async () => {
    const selectedRules = rules.filter(rule => rule.selected);
    if (selectedRules.length === 0) {
      toast.warn('Please select at least one rule to analyze');
      return;
    }
    if (testCases.length === 0) {
      toast.warn('Please add at least one test case');
      return;
    }
    try {
      const results = await Promise.all(
        selectedRules.flatMap(rule =>
          testCases.map(testCase =>
            evaluateRule(rule.name, testCase)
          )
        )
      );
      console.log('Analysis results:', results);
      toast.success('Test cases analyzed successfully');
    } catch (error) {
      toast.error('Failed to analyze test cases');
    }
  };

  return (
    <div>
      <h1>Rule Engine</h1>
      <RuleForm onSubmit={handleCreateRule} />
      <RuleList
        rules={rules}
        onDelete={handleDeleteRule}
        onToggleSelect={handleToggleSelect}
      />
      <TestCaseForm onSubmit={handleAddTestCase} />
      <AnalyzeRules
        onCombine={handleCombineRules}
        onAnalyze={handleAnalyzeTestCases}
      />
      <ToastContainer />
    </div>
  );
}

export default App;