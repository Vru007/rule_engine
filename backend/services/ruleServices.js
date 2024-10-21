class Node {
    constructor(type, value = null, left = null, right = null) {
        this.type = type;  // 'operator' or 'operand'
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class RuleEngine {
    constructor() {
        this.rules = new Map();
    }

    parseRuleString(ruleString) {
        const tokens = this.tokenize(ruleString);
        return this.parseTokens(tokens);
    }

    tokenize(ruleString) {
        return ruleString.match(/\(|\)|\w+|[<>=!]+|\d+|'[^']*'/g);
    }

    parseTokens(tokens) {
        const stack = [];
        let current = new Node('operator', 'AND');
        stack.push(current);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token === '(') {
                const newNode = new Node('operator', 'AND');
                if (!current.left) {
                    current.left = newNode;
                } else {
                    current.right = newNode;
                }
                stack.push(current);
                current = newNode;
            } else if (token === ')') {
                if (stack.length > 0) {
                    current = stack.pop();
                }
            } else if (['AND', 'OR'].includes(token)) {
                current.value = token;
            } else {
                const condition = `${tokens[i]} ${tokens[i+1]} ${tokens[i+2]}`;
                i += 2;
                const operandNode = new Node('operand', condition);
                if (!current.left) {
                    current.left = operandNode;
                } else if (!current.right) {
                    current.right = operandNode;
                } else {
                    const newParent = new Node('operator', current.value);
                    newParent.left = current;
                    newParent.right = operandNode;
                    if (stack.length > 0) {
                        const grandParent = stack[stack.length - 1];
                        if (grandParent.left === current) {
                            grandParent.left = newParent;
                        } else {
                            grandParent.right = newParent;
                        }
                    }
                    current = newParent;
                }
            }
        }

        while (stack.length > 0) {
            current = stack.pop();
        }

        return current;
    }

    createRule(name, ruleString) {
        const ast = this.parseRuleString(ruleString);
        this.rules.set(name, ast);
        return ast;
    }
    combineRules(rules) {
        if (rules.length === 0) return null;
        if (rules.length === 1) return rules[0];

        const combinedRule = new Node('operator', 'AND');
        combinedRule.left = rules[0];
        combinedRule.right = this.combineRules(rules.slice(1));

        return this.optimizeRule(combinedRule);
    }

    optimizeRule(rule) {
        if (!rule) return null;
        if (rule.type === 'operand') return rule;

        rule.left = this.optimizeRule(rule.left);
        rule.right = this.optimizeRule(rule.right);

        if (rule.left && rule.right && rule.left.type === 'operator' && rule.right.type === 'operator' &&
            rule.value === rule.left.value && rule.value === rule.right.value) {
            // Flatten nested AND/OR operations
            return new Node(rule.type, rule.value, 
                rule.left.left, 
                this.combineRules([rule.left.right, rule.right])
            );
        }

        return rule;
    }
    
    evaluateRule(jsonAst, data) {
        const ast = typeof jsonAst === 'string' ? JSON.parse(jsonAst) : jsonAst;
        return this.evaluate(ast, data);
    }

    evaluate(ast, data) {
        if (!ast) return true;

        if (ast.type === 'operator') {
            const leftResult = this.evaluate(ast.left, data);
            const rightResult = this.evaluate(ast.right, data);

            return ast.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
        } else if (ast.type === 'operand') {
            const [attribute, operator, value] = ast.value.split(' ');
            const dataValue = data[attribute];

            switch (operator) {
                case '>': return dataValue > parseFloat(value);
                case '<': return dataValue < parseFloat(value);
                case '>=': return dataValue >= parseFloat(value);
                case '<=': return dataValue <= parseFloat(value);
                case '=': return dataValue == value.replace(/'/g, '');
                case '!=': return dataValue != value.replace(/'/g, '');
                default: return false;
            }
        }

        return false;
    }
}

module.exports = new RuleEngine();