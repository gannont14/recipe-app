'use client';

import React, { useState } from 'react';

interface FractionInputProps {
  value: number;
  name?: string;
  onChange: (e: { target: { name: string; value: number } }) => void;
  placeholder?: string;
}

const FractionInput: React.FC<FractionInputProps> = ({
  value,
  onChange,
  name = 'amount',
  placeholder = 'Amount'
}) => {
  // State to handle the display value separately from the actual numeric value
  const [inputValue, setInputValue] = useState(value.toString());

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update display value immediately

    // Handle empty input
    if (newValue === '') {
      onChange({ target: { name, value: 0 } });
      return;
    }

    // Handle fractions
    if (newValue.includes('/')) {
      const [num, denom] = newValue.split('/');
      const numerator = parseFloat(num);
      const denominator = parseFloat(denom);
      
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        onChange({ target: { name, value: numerator / denominator } });
      }
      return;
    }

    // Handle decimals and whole numbers
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      onChange({ target: { name, value: numericValue } });
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={inputValue}
      onChange={handleAmountChange}
      placeholder={placeholder}
      className="w-20"/>
  );
};

export default FractionInput;
