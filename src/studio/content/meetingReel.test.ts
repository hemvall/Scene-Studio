import { describe, expect, it } from 'vitest'
import { ENVIRONMENTS } from '../environments/catalog'
import { buildExample, EXAMPLE_REELS } from './examples'

describe('meeting-room reel', () => {
  it('keeps the laptop footprint and latte on the table surface', () => {
    const dressing = ENVIRONMENTS['meeting-room'].dressing
    const laptop = dressing.find(p => p.id === 'laptop')!
    expect(laptop.position[1]).toBeCloseTo(0.79)
    expect(laptop.position[2] - 0.21).toBeGreaterThanOrEqual(-1.3)
    expect(laptop.position[2] + 0.21).toBeLessThanOrEqual(0.1)
    const latte = dressing.find(p => p.id === 'coffee')!
    expect(latte.kind).toBe('iced-latte')
    expect(latte.position[1]).toBeCloseTo(0.79)
    expect(latte.position[2]).toBeGreaterThan(-1.3)
    const tv = dressing.find(p => p.id === 'tv')!
    expect(tv.position[1] + 0.58 * tv.scale).toBeCloseTo(2.1, 2)
    expect(tv.position[2] + 0.019 * tv.scale).toBeGreaterThan(-4.405)
  })
  it('leaves the reaction silent and lands the second punchline within 25 seconds', () => {
    const reel = EXAMPLE_REELS.find(r => r.id === 'we-already-have-chatgpt')!
    const p = buildExample(reel)
    expect(p.scene.duration).toBe(24.8)
    expect(p.dialogue.filter(d => d.start < 16.2 && d.start + d.duration > 14.3)).toEqual([])
    expect(p.dialogue.at(-2)?.text).toBe('Can it do this meeting?')
    expect(p.dialogue.at(-1)?.text).toBe('Working on it.')
    for (let i = 1; i < p.dialogue.length; i++) {
      expect(p.dialogue[i]!.start).toBeGreaterThanOrEqual(p.dialogue[i - 1]!.start + p.dialogue[i - 1]!.duration)
    }
  })
})
