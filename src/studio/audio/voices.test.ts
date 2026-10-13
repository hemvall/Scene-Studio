import { afterEach, expect, it, vi } from 'vitest'
import { availableElevenVoices } from './voices'
afterEach(()=>vi.unstubAllGlobals())
it('loads available default voices without hardcoded IDs',async()=>{
  const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({voices:[{voice_id:'voice-one',labels:{gender:'male'}},{voice_id:'voice-two'},{}]})})
  vi.stubGlobal('fetch',fetcher)
  expect(await availableElevenVoices('test-only-placeholder')).toEqual(['voice-one','voice-two'])
  expect(fetcher.mock.calls[0]![0]).toContain('voice_type=default')
})
it('reports a permission problem without including the key',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:403}))
  await expect(availableElevenVoices('test-only-placeholder')).rejects.toThrow('Enable Voices Read')
})
