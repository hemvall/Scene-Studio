import { describe, expect, it } from 'vitest'
import { CharacterRig, type CharacterFrame } from './rig'
import { buildLew } from './lew'
import { buildCeo } from './ceo'
import { buildDev } from './dev'
import { CHARACTERS, idleProfile } from './catalog'
import { FACES } from '../animation/expressions'
import { actionsAt } from '../animation/actions'
import type { CharacterData, CharacterKind } from '../scene/model'
function make(kind: CharacterKind) {
  const def = CHARACTERS[kind]
  const data: CharacterData = { id: kind, kind, name: def.name, color: def.color, expression: def.expression, position: [0,0,0], rotation: [0,0,0], scale: 1, gaze: { kind: 'camera' } }
  const rig = new CharacterRig(data)
  ;({ lew: buildLew, ceo: buildCeo, dev: buildDev }[kind as 'lew' | 'ceo' | 'dev'])(rig)
  const frame: CharacterFrame = { data, time: 1.2, seed: 2, gaze: { headYaw: 0.1, headPitch: 0.05, eyeYaw: 0.12, eyePitch: 0.04 }, face: FACES[def.expression], action: actionsAt([], kind, 1.2), speaking: 0 }
  return { rig, frame }
}
function snapshot(rig: CharacterRig) {
  rig.root.updateMatrixWorld(true)
  const result: number[] = []
  rig.root.traverse(o => result.push(...o.matrixWorld.elements))
  return result
}
describe('cast personality at the rig boundary', () => {
  it('uses the same personality with or without an explicit idle profile', () => {
    for (const kind of ['lew', 'ceo', 'dev'] as const) {
      const { rig, frame } = make(kind)
      rig.update(frame)
      const implicit = snapshot(rig)
      rig.update({ ...frame, idle: idleProfile(CHARACTERS[kind].personality) })
      expect(snapshot(rig)).toEqual(implicit)
      rig.dispose()
    }
  })
  it('keeps Lew half-lidded even when a scene requests neutral', () => {
    const { rig, frame } = make('lew')
    rig.update({ ...frame, face: FACES.neutral })
    for (const eye of rig.eyes) expect(eye.lid.position.y / eye.radius).toBeLessThan(0.65)
    rig.dispose()
  })
  it('gives CEO a confused default, Dev a tired slouch and Lew normal blinking', () => {
    expect(CHARACTERS.ceo.expression).toBe('confused')
    expect(CHARACTERS.ceo.personality.reactionIntensity).toBe('medium')
    expect(CHARACTERS.dev.expression).toBe('tired')
    expect(idleProfile(CHARACTERS.dev.personality).posture).toBeGreaterThan(0.1)
    expect(CHARACTERS.lew.personality).toMatchObject({ idle: 'relaxed', reactionIntensity: 'subtle', blinkFrequency: 'normal', headMovement: 'restrained' })
  })
  it('reproduces every expression and gaze after out-of-order playback', () => {
    for (const kind of ['lew', 'ceo', 'dev'] as const) {
      const { rig, frame } = make(kind)
      for (const face of Object.values(FACES)) {
        const target = { ...frame, face, speaking: 0.65 }
        rig.update(target)
        const expected = snapshot(rig)
        rig.update({ ...frame, time: 47, face: FACES.surprised, gaze: { headYaw: -0.4, headPitch: 0.2, eyeYaw: -0.25, eyePitch: 0.1 } })
        rig.update(target)
        expect(snapshot(rig)).toEqual(expected)
        expect(expected.every(Number.isFinite)).toBe(true)
      }
      rig.dispose()
    }
  })
})
