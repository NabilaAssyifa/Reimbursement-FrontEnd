export default function formatDate(dbDate) {
  const dateObj = new Date(dbDate);
  return `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
}
