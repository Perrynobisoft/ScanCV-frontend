import { describe, expect, it } from 'vitest'
import { buildUrl } from '@/shared/url'

describe('buildUrl', () => {
  it('replaces url params and appends query params', () => {
    expect(
      buildUrl('/users/:id', { id: 42 }, { search: 'john doe', active: true }),
    ).toBe('/users/42?search=john+doe&active=true')
  })

  it('skips undefined query params', () => {
    expect(
      buildUrl('/users', null, { page: 1, sort: undefined, active: false }),
    ).toBe('/users?page=1&active=false')
  })
})
