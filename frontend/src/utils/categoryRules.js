export function detectCategory(title) {
  const text = (title || "").toLowerCase().trim();

  if (!text) return "Other";

  if (
    text.includes("zomato") ||
    text.includes("swiggy") ||
    text.includes("food") ||
    text.includes("cafe") ||
    text.includes("restaurant") ||
    text.includes("starbucks") ||
    text.includes("blinkit") ||
    text.includes("zepto") ||
    text.includes("grocery")
  )
    return "Food";

  if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("travel") ||
    text.includes("metro") ||
    text.includes("train") ||
    text.includes("flight") ||
    text.includes("fuel") ||
    text.includes("petrol") ||
    text.includes("diesel") ||
    text.includes("bus")
  )
    return "Travel";

  if (
    text.includes("rent") ||
    text.includes("house") ||
    text.includes("electricity") ||
    text.includes("water bill") ||
    text.includes("broadband") ||
    text.includes("wifi") ||
    text.includes("maintenance")
  )
    return "Housing";

  if (
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("myntra") ||
    text.includes("ajio") ||
    text.includes("shopping") ||
    text.includes("mall")
  )
    return "Shopping";

  return "Other";
}
