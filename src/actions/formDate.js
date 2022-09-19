 const convertUTCDateToLocalDate = (date) => {
    const newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
 };
  
export const formDate = (date, pattern = ['date', 'month', 'year']) => {
    const localDate = convertUTCDateToLocalDate(new Date(date));
    const newDate = String(localDate).split(" ");
    const dateObj = {
        date: newDate[2],
        month: newDate[1],
        year: newDate[3],
        time: newDate[4]
    };
    return pattern.map(el => dateObj[el]).join(' ');
};

export const formatDate = (date) => new Date(date).toISOString().split('.')[0];