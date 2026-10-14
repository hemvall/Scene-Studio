/** Screenplay dialogue is fitted inside each explicit scene window. */
export function screenplayDialogue(source: string) {
  const clean = source.replace(/```[\s\S]*?```/g, '')
  if (!/^\s*\*\*[A-Z][A-Z _-]+\*\*\s*$/m.test(clean)) return {text:source,names:[] as string[],storyboard:false}
  const names = new Set<string>(), groups: {start:number;end:number;lines:{speaker:string;text:string}[]}[] = []
  let speaker = '', group = {start:0,end:30,lines:[] as {speaker:string;text:string}[]}
  groups.push(group)
  const seconds = (s:string) => s.split(':').reduce((n,v)=>n*60+Number(v),0)
  for (const raw of clean.split('\n')) {
    const line = raw.trim()
    const time = /\[(\d+:\d+(?:\.\d+)?)[–—-](\d+:\d+(?:\.\d+)?)\]/.exec(line)
    if (time) {group={start:seconds(time[1]!),end:seconds(time[2]!),lines:[]};groups.push(group);speaker='';continue}
    const role = /^\*\*([A-Z][A-Z _-]+)\*\*$/.exec(line)
    if (role) {speaker=role[1]!.trim();names.add(speaker);continue}
    if (speaker && /^[“"«]/.test(line)) group.lines.push({speaker,text:line.replace(/^[“"«]|[”"»]$/g,'')})
    else if (line && !/^(pause|small pause)\.?$/i.test(line)) speaker=''
  }
  const output:string[]=[]
  for(const g of groups) {
    if(!g.lines.length) continue
    const weights=g.lines.map(l=>Math.max(1,l.text.split(/\s+/).length)), sum=weights.reduce((a,b)=>a+b,0)
    const budget=Math.max(.2*g.lines.length,g.end-g.start-.15*g.lines.length-.5)
    let time=g.start+(g.lines.length===1 && /^(…|\.\.\.)/.test(g.lines[0]!.text)? .6:0)
    // Leave coverage un-authored so the compiler can direct every speaker and reaction.
    output.push('['+time+']')
    for(const [i,l] of g.lines.entries()) {
      const duration=Math.max(.2,Math.min(budget*weights[i]!/sum,weights[i]!*.32+.6))
      output.push('['+time.toFixed(2)+']',l.speaker+' ('+duration.toFixed(2)+'s): "'+l.text+'"')
      time+=duration+.15
    }
  }
  return {text:output.join('\n'),names:[...names],storyboard:true}
}
