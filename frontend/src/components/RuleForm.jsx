import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, IconButton } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

const RuleForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [conditions, setConditions] = useState([{ attribute: '', operator: '', value: '' }]);

  const handleAddCondition = () => {
    setConditions([...conditions, { attribute: '', operator: '', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ruleString = conditions
      .map(c => `${c.attribute} ${c.operator} ${c.value}`)
      .join(' AND ');
    onSubmit({ name, ruleString });
    setName('');
    setConditions([{ attribute: '', operator: '', value: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Rule Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      {conditions.map((condition, index) => (
        <div key={index}>
          <TextField
            label="Attribute"
            value={condition.attribute}
            onChange={(e) => handleConditionChange(index, 'attribute', e.target.value)}
          />
          <Select
            value={condition.operator}
            onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
          >
            <MenuItem value=">">{">"}</MenuItem>
            <MenuItem value="<">{"<"}</MenuItem>
            <MenuItem value=">=">{"≥"}</MenuItem>
            <MenuItem value="<=">{"≤"}</MenuItem>
            <MenuItem value="=">{"="}</MenuItem>
            <MenuItem value="!=">{"≠"}</MenuItem>
          </Select>
          <TextField
            label="Value"
            value={condition.value}
            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
          />
          <IconButton onClick={() => handleRemoveCondition(index)}>
            <Remove />
          </IconButton>
        </div>
      ))}
      <IconButton onClick={handleAddCondition}>
        <Add />
      </IconButton>
      <Button type="submit" variant="contained" color="primary">
        Create Rule
      </Button>
    </form>
  );
};

export default RuleForm;