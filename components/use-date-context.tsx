import { useDate } from './date-context';

export function useDateContext() {
  const { date, setSelectedDate } = useDate();

  const setDate = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
  };

  return {
    date,
    setDate,
  };
}