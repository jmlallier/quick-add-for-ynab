import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { CurrencyFormat } from "../Popup/Popup";

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 12, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

const CurrencyInput = ({
  maskOptions,
  onNumericValue,
  ...inputProps
}: {
  maskOptions: CurrencyFormat;
  onNumericValue: (value: number) => void;
  inputProps: any;
}) => {
  const convertedMaskOptions = {
    prefix: maskOptions.symbol_first ? maskOptions.currency_symbol : "",
    suffix: !maskOptions.symbol_first ? maskOptions.currency_symbol : "",
    decimalLimit: maskOptions.decimal_digits,
    decimalSymbol: maskOptions.decimal_separator,
    thousandsSeparatorSymbol: maskOptions.group_separator,
    allowDecimal: maskOptions.decimal_separator !== "",
    symbol: maskOptions.currency_symbol,
  };
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...convertedMaskOptions,
  });

  const unmaskValue = (value: string) => {
    const unmasked = Number(value.replaceAll(/\D/g, ""));
    if (unmasked <= 0) return { value };
    const { decimalSymbol } = convertedMaskOptions;
    const multiplier = 3;
    const split = value
      .replace(convertedMaskOptions.symbol, "")
      .split(decimalSymbol);
    const decimalLength = split.length > 1 ? split[1].length : 0;
    const multiplierPlace = multiplier - decimalLength;
    const numericValue = unmasked * Number(1 + "0".repeat(multiplierPlace));
    onNumericValue(numericValue);

    return { value };
  };

  return <MaskedInput pipe={unmaskValue} mask={currencyMask} {...inputProps} />;
};

export default CurrencyInput;
