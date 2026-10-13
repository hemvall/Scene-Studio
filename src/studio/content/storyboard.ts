import type { StoryboardInsert } from '../scene/model'
export function storyboardInserts(source:string):StoryboardInsert[] {
  const scenes=source.split(/(?=^## SCENE\b)/m), result:StoryboardInsert[]=[]
  const seconds=(s:string)=>s.split(':').reduce((n,v)=>n*60+Number(v),0)
  for(const part of scenes) {
    const range=/\[(\d+:\d+)[–—-](\d+:\d+)\]/.exec(part)
    if(!range) continue
    const start=seconds(range[1]!),end=seconds(range[2]!)
    const blocks=[...part.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
    for(const [i,b] of blocks.entries()) {
      const before=part.slice(0,b.index),head=[...before.matchAll(/^### (.+)$/gm)].at(-1)?.[1] || 'Production systems'
      result.push({start:start+(end-start)*i/blocks.length,end:start+(end-start)*(i+1)/blocks.length,kind:'screen',title:head.replace(/\*\*/g,''),text:b[1]!.trim()})
    }
  }
  if (/FIRST DAY AT WORK/i.test(source) && /Small text appears/i.test(source)) result.push({start:0,end:1.5,kind:'label',title:'FIRST DAY AT WORK',text:''})
  const endCard=source.split(/^## END CARD/m)[1]
  if(endCard) {
    const title=[...endCard.matchAll(/^>\s*\*\*(.+?)\*\*/gm)].map(m=>m[1]!).join('\n')
    const end=Math.max(0,...[...source.matchAll(/\[\d+:\d+[–—-](\d+:\d+)\]/g)].map(m=>seconds(m[1]!)))
    if(title) result.push({start:end,end:end+2,kind:'card',title,text:''})
  }
  return result
}
