export const formatPrice = (price: number | string) => {
  return price.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
}