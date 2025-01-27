function formatDate(date) {
  if (!date) {
    return 'Invalid date';
  }

  // Ensure the date is parsed correctly from ISO 8601 format
  const [year, month, day] = date.split('-'); // Split "2025-01-01" into [2025, 01, 01]

  if (!year || !month || !day) {
    console.error('Invalid date format:', date);
    return 'Invalid date';
  }

  const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(parsedDate);
}

export default formatDate;
