const isFieldProvided = field => {
  if (typeof(field) === "number") {
    return true;
  }
  return field && field.length > 0;
}

const isFieldLengthValid = (field, requiredLength) => {
  return field && field.length >= requiredLength;
}

const isInteger = field => {
  return Number.isInteger(parseInt(field));
}

const isNumberPositiveInteger = field => {
  return Number.isInteger(parseInt(field)) && parseInt(field) > 0;
}

const isValidDate = date => {
  const testDate = Date.parse(date);
  return isNaN(testDate) === false;
}

const isValidTime = time => {
  return time.match(/^(?:\d{2}):(?:[0-5]\d)(:?:[0-5]\d)?$/)
}

const isValidStatus = status => {
  return status === "booked" || status === "seated" || status === "finished";
}

const isTuesday = date => {
  const reservationDate = new Date(date);
  if (reservationDate.getUTCDay() === 2) return true;
}

const isPastDate = date => {
  const reservationDate = new Date(date);
  const today = new Date();
  if (reservationDate < today) return true;
}

const isRestaurantOpen = (date, time) => {
  const reservationDate = new Date(`${date}T${time}`);
  const reservationTime = reservationDate.getTime();
  const openingTime = new Date(`${date}T10:30:00`).getTime();
  const closingTime = new Date(`${date}T21:30:00`).getTime();
  if (reservationTime < openingTime || reservationTime > closingTime) {
    return false;
  } 
  return true;
}

module.exports = {
  isFieldProvided,
  isFieldLengthValid,
  isInteger,
  isNumberPositiveInteger,
  isValidDate,
  isValidTime,
  isValidStatus,
  isTuesday,
  isPastDate,
  isRestaurantOpen,
}