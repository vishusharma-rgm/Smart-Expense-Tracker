const formatDay = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

const formatDate = (date) =>
  date.toLocaleDateString("en-US", { day: "2-digit" });

export default function GlassyCalendarIcon({ size = 28, className = "" }) {
  const style = { width: size, height: size };
  const now = new Date();
  return (
    <span className={`glassy-cal ${className}`.trim()} style={style} aria-hidden="true">
      <span className="glassy-cal__top" />
      <span className="glassy-cal__day">{formatDay(now)}</span>
      <span className="glassy-cal__date">{formatDate(now)}</span>
      <span className="glassy-cal__pins" />
    </span>
  );
}
