import { expect, it } from 'vitest'
import { headerApiKey } from './key'
it('removes invisible clipboard formatting and smart quote wrappers',()=>{
  expect(headerApiKey(' “test_\u200Bplaceholder-123”\n')).toBe('test_placeholder-123')
  expect(headerApiKey('\uFEFFtest_placeholder\u2060')).toBe('test_placeholder')
})
it('rejects invalid Unicode before building headers without exposing the input',()=>{
  expect(()=>headerApiKey('test_…')).toThrow('invalid characters')
  expect(()=>headerApiKey('')).toThrow('Add your API key')
})
it('preserves valid raw keys',()=>expect(headerApiKey('test_placeholder-123')).toBe('test_placeholder-123'))
