export function detectCategory(title) {
  const text = title.toLowerCase();

  if (text.includes("zomato") || text.includes("swiggy") || text.includes("food"))
    return "Food";

  if (text.includes("uber") || text.includes("ola") || text.includes("travel"))
    return "Travel";

  if (text.includes("rent") || text.includes("house"))
    return "Housing";

  if (text.includes("amazon") || text.includes("flipkart"))
    return "Shopping";

  return "Other";
}
