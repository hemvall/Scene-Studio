export async function availableElevenVoices(key:string, signal?:AbortSignal):Promise<string[]> {
  const response=await fetch('https://api.elevenlabs.io/v2/voices?voice_type=default&page_size=100',{headers:{'xi-api-key':key},signal})
  if(!response.ok) throw new Error('Cannot load ElevenLabs voices ('+response.status+'). Enable Voices Read on the key, or enter voice IDs in Script → Voice.')
  const body=await response.json() as {voices?:{voice_id?:string;labels?:{gender?:string}}[]}
  const voices=(body.voices || []).filter(v=>typeof v.voice_id==='string' && v.voice_id.length>0)
  voices.sort((a,b)=>Number(b.labels?.gender==='male')-Number(a.labels?.gender==='male'))
  if(!voices.length) throw new Error('No default voices available. Choose a voice in ElevenLabs and enter its ID in Script → Voice.')
  return voices.map(v=>v.voice_id!)
}
