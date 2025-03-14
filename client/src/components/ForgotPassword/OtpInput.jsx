import React, { useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
 
const OtpInput = ({
  value,
  onChange,
  length = 6,
  disabled = false,
}) => {
  const inputRefs = useRef([]);

  // Pre-fill refs array with null values based on OTP length
  useEffect(() => {
    inputRefs.current = Array(length).fill(null);
  }, [length]);

  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(inputValue)) return;
    
    // Take only the last character if multiple were pasted
    const digit = inputValue.slice(-1);
    
    // Update the OTP state
    const newOtp = value.split('');
    newOtp[index] = digit;
    const newOtpValue = newOtp.join('');
    onChange(newOtpValue);
    
    // Auto-focus next input if a digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a number of expected length
    if (/^\d+$/.test(pasteData) && pasteData.length <= length) {
      const newValue = pasteData.substring(0, length);
      onChange(newValue);
      
      // Focus last field or the field after the paste data length
      if (newValue.length < length) {
        inputRefs.current[newValue.length]?.focus();
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={1}
          className="w-12 h-12 text-center text-xl p-0"
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          ref={(el) => (inputRefs.current[index] = el)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default OtpInput;