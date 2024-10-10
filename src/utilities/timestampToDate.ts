import { SerializedTimestamp } from "@/src/types/projectTypes";

// Converts a SerializedTimestamp to a Date object
function timestampToDate(timestamp: SerializedTimestamp): Date {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return date;
}

// Converts a SerializedTimestamp to a human-readable string
function formatTimestamp(
  timestamp: SerializedTimestamp,
  locale: string = "zh-TW"
): string {
  try {
    const date = timestampToDate(timestamp);
    const formattedDate = date.toLocaleString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid Date";
  }
}

export default formatTimestamp;
