/** Clipboard formatting must never enter an HTTP credential header. */
export function headerApiKey(raw:string):string {
  const key=raw.replace(/[\s\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g,'').replace(/^["'“”‘’`]+|["'“”‘’`]+$/g,'')
  if(!key) throw new Error('Add your API key in Provider settings.')
  if(!/^[A-Za-z0-9_-]+$/.test(key)) throw new Error('The API key contains invalid characters. Copy the raw secret key again from your provider, without its label or placeholder.')
  return key
}
