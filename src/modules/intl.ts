import type { FingerprintData } from './types';

export function getIntlFingerprint(): FingerprintData[] {
  const results: FingerprintData[] = [];

  // Locale Formatting
  const numberFormat = new Intl.NumberFormat().format(1234567.89);
  const dateFormat = new Intl.DateTimeFormat().format(new Date('2024-02-29T12:00:00Z'));

  results.push({
    category: 'Intl',
    key: 'Number Format Sample',
    value: numberFormat,
    tooltip: 'Locale-specific separators and rounding behaviors.'
  });

  results.push({
    category: 'Intl',
    key: 'Date Format Sample',
    value: dateFormat,
    tooltip: 'Ordering of day/month/year and calendar interpretation.'
  });

  // PluralRules Differences
  const plural = new Intl.PluralRules();
  const pluralForms = {
    zero: plural.select(0),
    one: plural.select(1),
    two: plural.select(2),
    few: plural.select(3),
    many: plural.select(5),
    other: plural.select(100),
  };

  results.push({
    category: 'Intl',
    key: 'PluralRules Categories',
    value: JSON.stringify(pluralForms),
    tooltip: 'Different languages produce very different plural category mappings.'
  });

  // NumberFormat Edge Cases
  const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 });

  results.push({
    category: 'Intl',
    key: 'Float Precision (0.1 + 0.2)',
    value: nf.format(0.1 + 0.2),
    tooltip: 'Rounding rules differ subtly between engines.'
  });

  results.push({
    category: 'Intl',
    key: 'Negative Zero',
    value: nf.format(-0),
    tooltip: '"-0" formatting differs by browser and locale.'
  });

  // Intl.Calendar / Week Start
  try {
    // Modern API (Chrome 118+, Safari 17+, FF 120+)
    const cal = new Intl.Locale(navigator.language).weekInfo;
    if (cal) {
      results.push({
        category: 'Intl',
        key: 'Week Start Day',
        value: `${cal.firstDay}`,
        tooltip: 'Locale-specific first day of week.'
      });
    }
  } catch {
    // ignore
  }

  // Intl.Collator
  const collator = new Intl.Collator();
  const col = collator.compare('a', 'á');

  results.push({
    category: 'Intl',
    key: 'Collation (a vs á)',
    value: String(col),
    tooltip: 'Sorting accent sensitivity varies by locale and browser.'
  });

  return results;
}
