/** Import dialogue from a screenplay without treating technical code blocks as speech. */
export function screenplayDialogue(source: string) {
  const withoutCode = source.replace(/```[\s\S]*?```/g, '')
  if (!/^\s*\*\*[A-Z][A-Z _-]+\*\*\s*$/m.test(withoutCode)) return { text: source, names: [] as string[], storyboard: false }
  const output: string[] = [], names = new Set<string>()
  let speaker = ''
  for (const raw of withoutCode.split('\n')) {
    const line = raw.trim()
    const time = /\[(\d+:\d+(?:\.\d+)?)[–—-]/.exec(line)
    if (time) { output.push('[' + time[1] + ']'); speaker = ''; continue }
    const role = /^\*\*([A-Z][A-Z _-]+)\*\*$/.exec(line)
    if (role) { speaker = role[1]!.trim(); names.add(speaker); continue }
    if (speaker && /^[“"«]/.test(line)) output.push(speaker + ': "' + line.replace(/^[“"«]|[”"»]$/g, '') + '"')
    else if (line && !/^(pause|small pause)\.?$/i.test(line)) speaker = ''
  }
  return { text: output.join('\n'), names: [...names], storyboard: true }
}
