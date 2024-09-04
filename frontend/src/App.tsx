import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<[string, number, number, number]>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const fetchedHistory = await backend.getHistory();
      setHistory(fetchedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      performCalculation(operator, inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) return;

    setIsLoading(true);
    try {
      const result = await backend.calculate(op, firstOperand, secondOperand);
      setDisplay(result.toString());
      setFirstOperand(result);
      await fetchHistory();
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await backend.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="calculator">
      <div className="display">{isLoading ? <CircularProgress size={24} /> : display}</div>
      <div className="keypad">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((key) => (
          <Button
            key={key}
            className={`key ${
              ['+', '-', '*', '/'].includes(key) ? 'operation' : 
              key === '=' ? 'equal' : 
              key === 'C' ? 'clear' : 'number'
            }`}
            onClick={() => {
              if (key === '=') {
                operator && performCalculation(operator, parseFloat(display));
              } else if (['+', '-', '*', '/'].includes(key)) {
                handleOperator(key);
              } else if (key === '.') {
                inputDecimal();
              } else {
                inputDigit(key);
              }
            }}
            disabled={isLoading}
          >
            {key}
          </Button>
        ))}
        <Button className="key clear" onClick={clear} disabled={isLoading}>C</Button>
      </div>
      <div className="history">
        <h3>History</h3>
        {history.map((item, index) => (
          <div key={index} className="history-item">
            {`${item[1]} ${item[0]} ${item[2]} = ${item[3]}`}
          </div>
        ))}
        <Button onClick={clearHistory} disabled={isLoading}>Clear History</Button>
      </div>
    </div>
  );
};

export default App;
