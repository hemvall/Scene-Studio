import { expect, it } from 'vitest'
import { LEW_ARCHER, elevenSettings } from './profiles'
import { clipKey } from './tts'
it('uses the requested Archer profile',()=>{
  expect(LEW_ARCHER).toBe('L0Dsvb3SLTyegXwtm47J')
  expect(elevenSettings('lew')).toEqual({stability:.65,similarity_boost:.8,style:.15,speed:.95,use_speaker_boost:true})
  expect(elevenSettings('ceo').speed).toBeGreaterThan(elevenSettings('lew').speed)
})
it('regenerates cached audio when synthesis settings change',async()=>{
  const request={provider:'elevenlabs' as const,apiKey:'test-only-placeholder',model:'eleven_multilingual_v2',voice:LEW_ARCHER,language:'en' as const,text:'…yeah.',voiceSettings:elevenSettings('lew')}
  expect(await clipKey(request)).not.toBe(await clipKey({...request,voiceSettings:{...request.voiceSettings,speed:1}}))
})
