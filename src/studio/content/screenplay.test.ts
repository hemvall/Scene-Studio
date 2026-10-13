import { expect, it } from 'vitest'
import { screenplayDialogue } from './screenplay'
import { parseScript } from './script'

it('imports Markdown dialogue and scene times without speaking screen code or titles', () => {
  const source = '# THE AI GUY\n**[0:00–0:03]**\n**MANAGER**\n“Everyone, this is Lew.”\n\n**MANAGER**\n“He’s joining us to work on AI.”\n**[0:03–0:07]**\n**DEVELOPER**\n“So…”\n\n**DEVELOPER**\n“…ChatGPT?”\n**[0:07–0:20]**\n```text\nMODEL GATEWAY\n```\n**[0:23–0:27]**\n**LEW**\n“…yeah.”\n> **AI Engineering, apparently.**'
  const imported = screenplayDialogue(source)
  expect(imported.names).toEqual(['MANAGER', 'DEVELOPER', 'LEW'])
  const cast = imported.names.map(name => ({name,role:name.toLowerCase(),kind:'lew' as const}))
  const parsed = parseScript(imported.text,cast)
  expect(parsed.warnings).toEqual([])
  expect(parsed.dialogue).toHaveLength(5)
  expect(parsed.dialogue.at(-1)?.start).toBe(23.6)
  expect(imported.text).not.toContain('MODEL GATEWAY')
  expect(imported.text).not.toContain('AI Engineering')
})
it('preserves the editor script format', () => {
  const source = 'CAMERA: close-up Lew\nLEW: "Hello."\nPAUSE 0.7'
  expect(screenplayDialogue(source).text).toBe(source)
})

it('keeps a full screenplay longer than the former 2000 character notes limit', async () => {
  const { ContentStudio } = await import('./api')
  const { validateProject } = await import('./project')
  const document = ContentStudio.create({cast:['lew']})
  const source = '# Production screenplay\n' + 'Stage direction and engineering screen content.\n'.repeat(200)
  document.setScript('LEW: "Hello."')
  document.project.metadata.notes = source
  document.compileTimeline()
  expect(validateProject(document.project).metadata.notes).toBe(source)
})

it('fits dialogue into scene windows without overlapping the next scene', () => {
  const imported=screenplayDialogue('**[0:00–0:03]**\n**MANAGER**\n“Everyone, this is Lew.”\n**MANAGER**\n“He is joining us to work on AI.”\n**[0:03–0:07]**\n**DEVELOPER**\n“So…”\n**DEVELOPER**\n“…ChatGPT?”')
  const parsed=parseScript(imported.text,[{role:'manager',name:'MANAGER',kind:'ceo'},{role:'developer',name:'DEVELOPER',kind:'dev'}])
  for(let i=1;i<parsed.dialogue.length;i++) expect(parsed.dialogue[i]!.start).toBeGreaterThanOrEqual(parsed.dialogue[i-1]!.start+parsed.dialogue[i-1]!.duration)
  expect(parsed.dialogue[1]!.start+parsed.dialogue[1]!.duration).toBeLessThan(3)
})
it('fills the silent montage interval with timed screen inserts and adds the end card', async () => {
  const {storyboardInserts}=await import('./storyboard')
  const source='## SCENE 3\n**[0:07–0:20]**\n### SCREEN A — Runtime\n```text\nRouter -> Agent\n```\n### SCREEN B — Evals\n```text\nDEPLOYMENT BLOCKED\n```\n## SCENE 5\n**[0:23–0:27]**\n## END CARD\n> **Engineering.**'
  const inserts=storyboardInserts(source)
  expect(inserts[0]!.start).toBe(7)
  expect(inserts[0]!.end).toBe(inserts[1]!.start)
  expect(inserts[1]!.end).toBe(20)
  expect(inserts.at(-1)).toMatchObject({start:27,end:29,kind:'card',title:'Engineering.'})
})
