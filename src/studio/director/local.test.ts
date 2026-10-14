import { expect, it } from 'vitest'
import { ContentStudio } from '../content/api'
import { localDirector } from './local'
import { applyScript } from './script'
import { emptyScene } from '../scene/examples'
import { cameraAt } from '../timeline/evaluate'
import { parseScene, serializeScene, validateScene } from '../serialization/scene'
import type { CameraPose } from '../scene/model'

it.each([
  ['vertical', ['lew', 'ceo']],
  ['set scene in night bar', ['lew', 'ceo']],
  ['add Lew', ['ceo']],
  ['remove Lew', ['lew', 'ceo']]
] as const)('frames cameras using the effective scene after "%s"', (direction, cast) => {
  const scene = ContentStudio.create({ cast: [...cast], environment: 'meeting-room' }).project.scene
  scene.aspect = '16:9'
  const camera = direction === 'remove Lew' ? 'CAMERA: two-shot CEO' : 'CAMERA: close-up Lew'
  const before = structuredClone(scene)
  const effective = applyScript(scene, localDirector(direction, scene), () => emptyScene())
  const expected = applyScript(effective.scene, localDirector(camera, effective.scene), () => emptyScene())
  const actual = applyScript(scene, localDirector(`${direction}; ${camera}`, scene), () => emptyScene())
  expect(effective.warnings).toEqual([])
  expect(actual.warnings).toEqual([])
  expect(actual.scene.timeline.filter(event => event.type === 'camera')).toHaveLength(1)
  expect(cameraAt(actual.scene, 0)).toEqual(cameraAt(expected.scene, 0))
  expect(scene).toEqual(before)
})

it.each([false, true])('preserves interrupted movement before a held cut (directions reversed: %s)', reversed => {
  const scene = ContentStudio.create({ cast: ['lew', 'ceo'], environment: 'meeting-room' }).project.scene
  const movement = 'CAMERA: close-up Lew slow-push at 0s for 4 seconds'
  const cutDirection = 'CAMERA: profile CEO at 2s'
  const script = localDirector(reversed ? `${cutDirection}; ${movement}` : `${movement}; ${cutDirection}`, scene)
  const applied = applyScript(scene, script, () => emptyScene())
  const uninterrupted = applyScript(scene, localDirector(movement, scene), () => emptyScene()).scene
  const cut = applyScript(scene, localDirector('CAMERA: profile CEO at 2s', scene), () => emptyScene()).scene
  expect(applied.warnings).toEqual([])
  expect(cameraAt(applied.scene, 1).position).not.toEqual(cameraAt(applied.scene, 0).position)
  for (const time of [0.5, 1, 1.5, 1.99999, 1.999999]) {
    expect(cameraAt(applied.scene, time)).toEqual(cameraAt(uninterrupted, time))
  }
  for (const time of [2, 3, 4, 5]) expect(cameraAt(applied.scene, time)).toEqual(cameraAt(cut, 2))
  expect(script.ops.some(op => op.op === 'camera' && op.time === 4)).toBe(false)
  const restored = parseScene(serializeScene(applied.scene))
  expect(restored).toEqual(applied.scene)
  for (const time of [0.5, 1, 1.5, 1.999999, 2, 4]) expect(cameraAt(restored, time)).toEqual(cameraAt(applied.scene, time))
})

it.each([0, 4])('holds the new shot when a cut coincides with a movement boundary at %ss', time => {
  const scene = ContentStudio.create({ cast: ['lew', 'ceo'] }).project.scene
  const movement = 'CAMERA: close-up Lew slow-push at 0s for 4 seconds'
  const cutDirection = `CAMERA: profile CEO at ${time}s`
  const actual = applyScript(scene, localDirector(`${movement}; ${cutDirection}`, scene), () => emptyScene())
  const cut = applyScript(scene, localDirector(cutDirection, scene), () => emptyScene()).scene
  expect(actual.warnings).toEqual([])
  for (const t of [time, time + 0.5, time + 2]) expect(cameraAt(actual.scene, t)).toEqual(cameraAt(cut, time))
})

it('preserves changing position, target and fov on the original nonzero-start easing domain', () => {
  const scene = emptyScene()
  const start: CameraPose = { position: [1, 2, 3], target: [0, 1, 0], fov: 40 }
  const end: CameraPose = { position: [5, 6, 7], target: [4, 5, 6], fov: 60 }
  const cut: CameraPose = { position: [-1, 2, 5], target: [-2, 1, 0], fov: 30 }
  const original = applyScript(scene, { reply: '', ops: [
    { op: 'camera', time: 3, pose: start, cut: true },
    { op: 'camera', time: 7, pose: end }
  ] }, () => emptyScene()).scene
  const actual = applyScript(scene, { reply: '', ops: [
    { op: 'camera', time: 3, pose: start, cut: true },
    { op: 'camera', time: 5, pose: cut, cut: true, outgoing: { endTime: 7, pose: end } }
  ] }, () => emptyScene())
  expect(actual.warnings).toEqual([])
  const restored = parseScene(serializeScene(actual.scene))
  for (const t of [3, 3.5, 4, 4.5, 4.999999]) expect(cameraAt(restored, t)).toEqual(cameraAt(original, t))
  expect(cameraAt(restored, 4)).toEqual({ position: [1.625, 2.625, 3.625], target: [0.625, 1.625, 0.9375], fov: 43.125 })
  for (const t of [5, 5.5, 7, 8]) expect(cameraAt(restored, t)).toEqual(cut)
})

it.each([
  { endTime: 1, pose: { position: [1, 2, 3], target: [0, 1, 0], fov: 40 } },
  { endTime: Number.NaN, pose: { position: [1, 2, 3], target: [0, 1, 0], fov: 40 } },
  { endTime: 301, pose: { position: [1, 2, 3], target: [0, 1, 0], fov: 40 } },
  { endTime: 4, pose: { position: [1, 2], target: [0, 1, 0], fov: 40 } },
  { endTime: 4, pose: { position: [1, 2, 3], target: [0, 1, 0], fov: 0 } }
])('rejects malformed outgoing camera metadata: %j', outgoing => {
  const scene = emptyScene()
  const input = { ...scene, timeline: [{ id: 'cut', type: 'camera', time: 2, pose: scene.camera, cut: true, outgoing }] }
  expect(() => validateScene(input)).toThrow()
})

it('rejects outgoing movement metadata without a cut', () => {
  const scene = emptyScene()
  expect(() => validateScene({ ...scene, timeline: [{
    id: 'move', type: 'camera', time: 2, pose: scene.camera, outgoing: { endTime: 4, pose: scene.camera }
  }] })).toThrow('Outgoing camera movement requires a cut')
})

it('preserves line-separated camera and silent reaction beats in the local director', () => {
  const scene = ContentStudio.create({ cast: ['lew', 'ceo'] }).project.scene
  const script = localDirector('CAMERA: wide CEO\nPAUSE 2\nCEO looks away.\nPAUSE 0.5\nCAMERA: profile CEO', scene)
  expect(script.reply).not.toContain('could not read')
  const cameras = script.ops.filter(op => op.op === 'camera')
  expect(cameras.map(op => op.time)).toEqual([0, 2.5])
  expect(script.ops).toContainEqual({ op: 'gaze', character: 'ceo', target: expect.any(Array), time: 2 })
})

it('directs two-shots, reverse shoulders and moving close-ups into actual cut poses locally', () => {
  const scene = ContentStudio.create({ cast: ['lew', 'ceo'], environment: 'meeting-room' }).project.scene
  const script = localDirector('CAMERA: two-shot Lew CEO at 0s; CAMERA: over-shoulder Lew CEO at 3s; CAMERA: over-shoulder CEO Lew at 6s; CAMERA: profile CEO at 9s; CAMERA: close-up Lew slow-push at 12s for 2 seconds', scene)
  const applied = applyScript(scene, script, () => emptyScene())
  expect(applied.warnings).toEqual([])
  expect(script.reply).not.toContain('could not read')
  const cameras = applied.scene.timeline.filter(e => e.type === 'camera')
  expect(cameras.filter(e => e.cut)).toHaveLength(5)
  expect(new Set([0, 3, 6, 9, 12].map(t => JSON.stringify(cameraAt(applied.scene, t).position))).size).toBe(5)
  expect(cameraAt(applied.scene, 2.99)).toEqual(cameraAt(applied.scene, 0))
  expect(cameraAt(applied.scene, 13).position).not.toEqual(cameraAt(applied.scene, 12).position)
})
