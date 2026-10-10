import { formatStock, inputFields, totalFromFields, countSummary, formatSigned, parseNumber } from '../quantity';

const KOLI = { name: 'Koli', factor: 24 };

describe('Stok gösterimi', () => {
  it('koli tanımlıysa koli karşılığını da gösterir', () => {
    expect(formatStock(360, 'adet', KOLI)).toBe('15 koli · 360 adet');
    expect(formatStock(363, 'adet', KOLI)).toBe('15 koli 3 adet · 363 adet');
    expect(formatStock(16, 'adet', KOLI)).toBe('16 adet');
    expect(formatStock(1440, 'adet', KOLI)).toBe('60 koli · 1.440 adet');
  });
  it('koli tanımlı değilse varsayım yapmaz', () => {
    expect(formatStock(360, 'adet', null)).toBe('360 adet');
  });
  it('gram ürünleri kilogramla gösterir', () => {
    expect(formatStock(2000, 'gram')).toBe('2 kg');
    expect(formatStock(1850, 'gram')).toBe('1,85 kg');
    expect(formatStock(1234, 'gram')).toBe('1,234 kg');
    expect(formatStock(850, 'gram')).toBe('850 g');
    expect(formatStock(0, 'gram')).toBe('0 g');
  });
  it('mililitreyi litreyle gösterir', () => {
    expect(formatStock(1500, 'mililitre')).toBe('1,5 L');
    expect(formatStock(750, 'mililitre')).toBe('750 ml');
  });
});

describe('Karma giriş', () => {
  it('2 koli + 5 adet = 53 adet', () => {
    const f = inputFields('adet', KOLI);
    expect(f.map((x) => x.label)).toEqual(['koli', 'adet']);
    const r = totalFromFields({ pkg: '2', base: '5' }, f, 'adet');
    expect(r).toEqual({ ok: true, total: 53, breakdown: '2 koli + 5 adet', empty: false });
  });
  it('koli tanımsız üründe yalnızca adet alanı vardır', () => {
    expect(inputFields('adet', null).map((x) => x.label)).toEqual(['adet']);
  });
  it('kg ve g birlikte: 1,5 kg + 250 g = 1750 g', () => {
    const f = inputFields('gram');
    expect(f.map((x) => x.label)).toEqual(['kg', 'g']);
    const r = totalFromFields({ big: '1,5', base: '250' }, f, 'gram');
    expect(r.ok && r.total).toBe(1750);
  });
  it('kesirli adet ve kesirli koli reddedilir', () => {
    const f = inputFields('adet', KOLI);
    expect(totalFromFields({ base: '2,5' }, f, 'adet').ok).toBe(false);
    expect(totalFromFields({ pkg: '0,5' }, f, 'adet').ok).toBe(false);
  });
  it('gramın altına düşen kg reddedilir (1,2345 kg)', () => {
    expect(totalFromFields({ big: '1,2345' }, inputFields('gram'), 'gram').ok).toBe(false);
  });
  it('boş giriş 0 ve "boş" olarak işaretlenir', () => {
    expect(totalFromFields({}, inputFields('adet', KOLI), 'adet')).toEqual({ ok: true, total: 0, breakdown: '', empty: true });
  });
  it('geçersiz metin reddedilir', () => {
    expect(parseNumber('12a')).toBeNull();
    expect(parseNumber('-3')).toBeNull();
    expect(parseNumber('1,25')).toBe(1.25);
  });
});

describe('Sayım farkı', () => {
  it('sistem 2000 g, sayımda 1850 g → −150 g, sonrası 1850 g', () => {
    const s = countSummary(2000, 1850);
    expect(s).toEqual({ diff: -150, after: 1850 });
    expect(formatSigned(s.diff, 'gram')).toBe('−150 g');
    expect(formatStock(s.after, 'gram')).toBe('1,85 kg');
  });
  it('fazla çıkan sayım artı gösterilir', () => {
    expect(formatSigned(countSummary(16, 36).diff, 'adet')).toBe('+20 adet');
  });
});
