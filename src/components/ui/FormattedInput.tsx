import React, { useState, useEffect } from "react";
import {
  formatNumberWithCommas,
  unformatNumber,
} from "../../helpers/formatterUtility";

export interface FormattedInputChangeEvent {
  target: { name: string; value: string | number };
  currentTarget?: { name: string; value: string | number };
  persist?: () => void;
}

export interface FormattedInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  value?: string | number;
  onChange?: (e: FormattedInputChangeEvent | React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const FormattedInput: React.FC<FormattedInputProps> = ({
  value = "",
  onChange,
  name = "",
  className,
  onFocus,
  onBlur,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const externalDisplayValue =
    value === "" || value === undefined || value === null
      ? ""
      : formatNumberWithCommas(value);

  useEffect(() => {
    if (!isFocused) {
      queueMicrotask(() => setInputValue(externalDisplayValue));
    }
  }, [externalDisplayValue, isFocused]);

  const displayValue = isFocused ? inputValue : externalDisplayValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    if (!/^[0-9,.]*$/.test(nextValue)) return;

    if (nextValue.trim() === "") {
      setInputValue("");
      onChange?.({
        target: { name, value: "" },
        currentTarget: { name, value: "" },
        persist: () => {},
      });
      return;
    }

    // Handle decimal formatting
    let formattedValue = "";
    if (nextValue.includes(".")) {
      const parts = nextValue.split(".");
      if (parts.length > 2) return; // ignore more than 1 decimal point
      const cleanInt = parts[0].replace(/,/g, "");
      const formattedInt =
        cleanInt === "" ? "" : formatNumberWithCommas(cleanInt);
      formattedValue = `${formattedInt}.${parts[1]}`;
    } else {
      formattedValue = formatNumberWithCommas(nextValue);
    }

    const rawValue = unformatNumber(nextValue);
    setInputValue(formattedValue);

    onChange?.({
      target: { name, value: rawValue },
      currentTarget: { name, value: rawValue },
      persist: () => {},
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setInputValue(externalDisplayValue);

    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      name={name}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default FormattedInput;
