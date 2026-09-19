export function formatCurrency(amount: number, symbol = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }
  
  // Format to Indian numbering system (Lakhs, Crores)
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));
  const amountStr = absAmount.toString();
  
  let result = '';
  if (amountStr.length <= 3) {
    result = amountStr;
  } else {
    const lastThree = amountStr.substring(amountStr.length - 3);
    const otherNumbers = amountStr.substring(0, amountStr.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedOther},${lastThree}`;
  }
  
  return `${isNegative ? '-' : ''}${symbol}${result}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function generateQuotationNumber(existingCount = 0): string {
  const year = new Date().getFullYear();
  const nextNum = (existingCount + 148).toString().padStart(4, '0');
  return `QT-${year}-${nextNum}`;
}

export function numberToWordsINR(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanThousand(n: number): string {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  }

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const remaining = Math.floor(num % 1000);

  let result = '';
  if (crores > 0) {
    result += convertLessThanThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertLessThanThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertLessThanThousand(thousands) + ' Thousand ';
  }
  if (remaining > 0) {
    result += convertLessThanThousand(remaining) + ' ';
  }

  return (result.trim() + ' Rupees Only').replace(/\s+/g, ' ');
}
