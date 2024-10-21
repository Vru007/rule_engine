import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Update with your backend URL

export const createRule = async (rule) => {
  const response = await axios.post(`${API_URL}/create`, rule);
  return response.data;
};

export const evaluateRule = async (name, data) => {
  const response = await axios.post(`${API_URL}/evaluate`, { name, data });
  return response.data;
};

export const combineRules = async (ruleNames) => {
  const response = await axios.post(`${API_URL}/combine`, { ruleNames });
  return response.data;
};

export const getRules = async () => {
  const response = await axios.get(`${API_URL}/rules`);
  return response.data;
};

export const deleteRule = async (name) => {
  const response = await axios.delete(`${API_URL}/rules/${name}`);
  return response.data;
};