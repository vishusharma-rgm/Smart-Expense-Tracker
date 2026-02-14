const SETTINGS_KEY = "app_settings";

const defaultSettings = {
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
};

export const getSettings = () => {
  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}),
    };
  } catch {
    return defaultSettings;
  }
};

export const formatCurrency = (value) => {
  const { currency } = getSettings();
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(Number(value || 0));
};

export const formatDate = (value) => {
  const { dateFormat } = getSettings();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  if (dateFormat === "MM/DD/YYYY") return `${mm}/${dd}/${yyyy}`;
  if (dateFormat === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
  return `${dd}/${mm}/${yyyy}`;
};
