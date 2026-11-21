// Fake Store supplies demo amounts. The catalogue treats them as rupees for display.
export const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
