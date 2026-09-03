/**
 * Peso amounts, rendered the way a rate card reads: no centavos on whole
 * figures, since room rates are always quoted in round numbers.
 */
export const formatPrice = (price: number | string) => {
  const value = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(value)) return String(price);

  return value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });
};
