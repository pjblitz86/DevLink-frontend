function formatDate(date) {
  if (!date) {
    return 'Invalid date';
  }

  try {
    // Parse the date into a JavaScript Date object
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', date);
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error, 'Input date:', date);
    return 'Invalid date';
  }
}

export default formatDate;
