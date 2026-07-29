import { describe, expect, it } from 'vitest'

import { formatFileSize } from '@/lib/format'

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [1, '1 B'],
    [1023, '1023 B'],
    [1024, '1.0 KB'],
    [839_680, '820 KB'],
    [1_048_576, '1.0 MB'],
    [1_153_434, '1.1 MB'],
    [1_073_741_824, '1.0 GB'],
  ])('formats %i as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected)
  })

  it('switches from one decimal to none at ten', () => {
    // Below ten the extra digit carries information; above it, it is noise.
    expect(formatFileSize(9.4 * 1024)).toBe('9.4 KB')
    expect(formatFileSize(10.4 * 1024)).toBe('10 KB')
  })

  it('returns nothing for a value it cannot describe', () => {
    // A size of NaN reaches here from an unset File.size often enough to be
    // worth handling; rendering "NaN undefined" in the UI is not an option.
    expect(formatFileSize(Number.NaN)).toBe('')
    expect(formatFileSize(-1)).toBe('')
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe('')
  })
})
