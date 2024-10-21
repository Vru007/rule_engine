import React from 'react';
import { List, ListItem, ListItemText, Checkbox, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const RuleList = ({ rules, onDelete, onToggleSelect }) => {
  return (
    <List>
      {rules.map((rule) => (
        <ListItem key={rule.name}>
          <Checkbox
            checked={rule.selected}
            onChange={() => onToggleSelect(rule.name)}
          />
          <ListItemText primary={rule.name} secondary={rule.ruleString} />
          <IconButton onClick={() => onDelete(rule.name)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default RuleList;