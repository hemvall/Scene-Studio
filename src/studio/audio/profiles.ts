import type { CharacterKind } from '../scene/model'
export const LEW_ARCHER = 'L0Dsvb3SLTyegXwtm47J'
export interface ElevenSettings {stability:number;similarity_boost:number;style:number;speed:number;use_speaker_boost:boolean}
export function elevenSettings(kind:CharacterKind):ElevenSettings {
  if(kind==='lew') return {stability:.65,similarity_boost:.8,style:.15,speed:.95,use_speaker_boost:true}
  if(kind==='ceo') return {stability:.5,similarity_boost:.8,style:.25,speed:1.06,use_speaker_boost:true}
  return {stability:.5,similarity_boost:.75,style:.1,speed:1,use_speaker_boost:true}
}
export const CEO_DIRECTION = 'Confident male executive in his mid-40s. Warm, polished corporate voice. Authority and enthusiasm, natural and believable, never cartoonish. Medium-low pitch, clear articulation, moderately fast delivery.'
export const LEW_DIRECTION = 'Young British male. Calm, neutral, understated and slightly weary. A short pause before answering. No exaggerated comedy; deadpan delivery.'
