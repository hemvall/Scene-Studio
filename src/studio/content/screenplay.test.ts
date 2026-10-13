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
  expect(parsed.dialogue.at(-1)?.start).toBe(23)
  expect(imported.text).not.toContain('MODEL GATEWAY')
  expect(imported.text).not.toContain('AI Engineering')
})
it('preserves the editor script format', () => {
  const source = 'CAMERA: close-up Lew\nLEW: "Hello."\nPAUSE 0.7'
  expect(screenplayDialogue(source).text).toBe(source)
})
