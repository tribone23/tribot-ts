type DateRange = {
  from: Date;
  to: Date;
};

type ParseResult = {
  dataRange: DateRange[];
  sumType: string;
} | null;

export function parseDateInput(input: string): ParseResult {
  const dataRange: DateRange[] = [];
  let sumType: string = '';

  const fullDateRangeRegex = /^\d{4}-\d{2}-\d{2}\s\d{4}-\d{2}-\d{2}$/;
  const monthYearRegex = /^\d{4}-\d{2}$/;
  const singleDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (fullDateRangeRegex.test(input)) {
    const [from, to] = input.split(' ');
    dataRange.push({
      from: new Date(from),
      to: new Date(to),
    });
    sumType = 'daily';
  } else if (monthYearRegex.test(input)) {
    const [year, month] = input.split('-');
    const from = new Date(`${year}-${month}-01`);
    const to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    dataRange.push({
      from: from,
      to: to,
    });
    sumType = 'monthly';
  } else if (singleDateRegex.test(input)) {
    const from = new Date(input);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    dataRange.push({
      from: from,
      to: to,
    });
    sumType = 'daily';
  } else {
    return null;
  }

  return { dataRange, sumType };
}
