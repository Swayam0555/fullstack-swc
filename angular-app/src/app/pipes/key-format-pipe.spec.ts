import { KeyFormatPipe } from './key-format-pipe';

describe('KeyFormatPipe', () => {
  let pipe: KeyFormatPipe;

  beforeEach(() => {
    pipe = new KeyFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a raw key string into hyphenated blocks of 4 characters', () => {
    expect(pipe.transform('a3f9b21c4de7')).toBe('A3F9-B21C-4DE7');
    expect(pipe.transform('a3f9-b21c-4de7')).toBe('A3F9-B21C-4DE7');
    expect(pipe.transform('abc')).toBe('ABC');
    expect(pipe.transform(undefined)).toBe('');
  });
});
