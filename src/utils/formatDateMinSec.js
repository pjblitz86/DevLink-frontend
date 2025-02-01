function formatDateMinSec(date) {
  if (!date) {
    return 'Invalid date';
  }

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', date);
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Ensures AM/PM format
    }).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error, 'Input date:', date);
    return 'Invalid date';
  }
}

export default formatDateMinSec;
