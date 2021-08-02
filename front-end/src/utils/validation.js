export const isPastDate = (date, time) => {
  const reservationDate = new Date(`${date}T${time}`);
  return reservationDate < new Date();
}

export const isTuesday = date => {
  const reservationDate = new Date(date);
  return reservationDate.getUTCDay() === 2;
}

export const isRestaurantClosed = (date, time) => {
  const reservationDate = new Date(`${date}T${time}`);
  const reservationTime = reservationDate.getTime();
  const openingTime = new Date(`${date}T10:30:00`).getTime();
  const closingTime = new Date(`${date}T21:30:00`).getTime();
  return reservationTime < openingTime || reservationTime > closingTime;
}

export const doesTableHaveCapacity = (table, reservation) => {
  return reservation.people <= table.capacity;
}

export const isTableOccupied = table => {
  return table.reservation_id != null;
}