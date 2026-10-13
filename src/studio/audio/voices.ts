import { headerApiKey } from './key'
export async function availableElevenVoices(key:string, signal?:AbortSignal):Promise<string[]> {
  const response=await fetch('https://api.elevenlabs.io/v2/voices?voice_type=default&page_size=100',{headers:{'xi-api-key':headerApiKey(key)},signal})
  if(!response.ok) throw new Error('Cannot load ElevenLabs voices ('+response.status+'). Enable Voices Read on the key, or enter voice IDs in Script → Voice.')
  const body=await response.json() as {voices?:{voice_id?:string;name?:string;description?:string;labels?:{gender?:string;age?:string;use_case?:string}}[]}
  const voices=(body.voices || []).filter(v=>typeof v.voice_id==='string' && v.voice_id.length>0)
  const score=(v:typeof voices[number])=>Number(v.labels?.gender==='male')*100+Number(/middle|mature/i.test(v.labels?.age || ''))*20+Number(/professional|confident|authoritative|corporate|warm/i.test([v.name,v.description,v.labels?.use_case].join(' ')))*10
  voices.sort((a,b)=>score(b)-score(a))
  if(!voices.length) throw new Error('No default voices available. Choose a voice in ElevenLabs and enter its ID in Script → Voice.')
  return voices.map(v=>v.voice_id!)
}
