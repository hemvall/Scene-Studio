import { describe, expect, it } from 'vitest'
import { ContentStudio } from './api'
import { compileProject } from './compile'
import { cameraAt } from '../timeline/evaluate'
import { screenplayDialogue } from './screenplay'

const dialogue = `CEO: "Our agents all have access to production."
LEW: "Who approves the writes?"
CEO: "The other agent."
LEW: "So nobody."
PAUSE 0.8
CEO: "But the demo worked."
LEW: "A demo is not an on-call rotation."`

describe('automatic business coverage', () => {
  it('gives imported screenplay real speaker coverage instead of a medium on the first speaker only', () => {
    const source = '**[0:00-0:20]**\n**CEO**\n“Can we ship it?”\n**LEW**\n“After evaluation.”\n**CEO**\n“It sounded confident.”\n**LEW**\n“So did the sales deck.”'
    const studio = ContentStudio.create({ cast: ['lew', 'ceo'] })
    expect(studio.setScript(screenplayDialogue(source).text)).toEqual([])
    const { scene } = studio.compileTimeline()
    const cameras = scene.timeline.filter(e => e.type === 'camera')
    expect(cameras.some(e => e.label?.includes('Over the shoulder'))).toBe(true)
    expect(cameras.some(e => e.label?.includes('Close-up'))).toBe(true)
    expect(cameraAt(scene, studio.project.dialogue[0]!.start).position).not.toEqual(cameraAt(scene, studio.project.dialogue[1]!.start).position)
  })

  it('compiles unshot dialogue into varied real poses, reverse shoulders and a moving punchline', () => {
    const studio = ContentStudio.create({ environment: 'meeting-room', cast: ['lew', 'ceo'] })
    expect(studio.setScript(dialogue)).toEqual([])
    const { scene, warnings } = studio.compileTimeline()
    expect(warnings).toEqual([])
    const keys = scene.timeline.filter(e => e.type === 'camera')
    const labels = keys.map(e => e.label ?? '').join('\n')
    for (const label of ['Wide', 'Two-shot', 'Over the shoulder', 'Profile', 'Close-up']) expect(labels).toContain(label)
    const lew = studio.project.dialogue[1]!, ceo = studio.project.dialogue[2]!
    expect(cameraAt(scene, lew.start).position).not.toEqual(cameraAt(scene, ceo.start).position)
    const last = studio.project.dialogue.at(-1)!
    expect(cameraAt(scene, last.start + last.duration / 2).position).not.toEqual(cameraAt(scene, last.start).position)
    expect(new Set(keys.map(e => JSON.stringify(e.pose.position))).size).toBeGreaterThanOrEqual(6)
    expect(compileProject(studio.project).scene).toEqual(scene)
    expect(studio.project.shots).toEqual([]) // derived coverage does not overwrite authored data
  })

  it('holds a listener reaction during an explicit pause rather than talking over it', () => {
    const studio = ContentStudio.create({ cast: ['lew', 'ceo'] })
    studio.setScript(dialogue)
    const { scene } = studio.compileTimeline()
    const line = studio.project.dialogue[3]!
    const reaction = scene.timeline.find(e => e.type === 'camera' && e.time > line.start + line.duration && e.time < studio.project.dialogue[4]!.start)
    expect(reaction).toMatchObject({ label: expect.stringContaining('CEO') })
  })
})
