import { describe, expect, it, vi } from 'vitest'
import * as T from 'three'
import { SceneEngine } from './SceneEngine'
import { drawOverlay } from './overlay'
import { emptyScene } from '../scene/examples'

vi.mock('../subtitles/draw', () => ({ drawSubtitles: vi.fn() }))
describe('Frame compositing', () => {
  it('preserves the 3D image while drawing export captions, at every timestamp', () => {
    let scenePixelsVisible = false
    const target = {
      drawImage: vi.fn(() => { scenePixelsVisible = true }),
      clearRect: vi.fn(() => { scenePixelsVisible = false })
    } as unknown as CanvasRenderingContext2D
    const engine = Object.create(SceneEngine.prototype) as SceneEngine
    const source = {} as HTMLCanvasElement
    Object.assign(engine, {
      scene: emptyScene(),
      renderer: { setPixelRatio: vi.fn(), setSize: vi.fn(), domElement: source },
      composer: { setPixelRatio: vi.fn(), setSize: vi.fn() },
      camera: new T.PerspectiveCamera(), renderFrame: vi.fn(), resize: vi.fn()
    })
    const capture = engine.capture(1080, 1920)
    for (const time of [0, 1, 0.5]) {
      capture.frame(time, target)
      expect(scenePixelsVisible).toBe(true)
      expect(target.drawImage).toHaveBeenLastCalledWith(source, 0, 0, 1080, 1920)
    }
    expect(target.clearRect).not.toHaveBeenCalled()
    capture.end()
  })
  it('still clears the independent preview overlay between frames', () => {
    const ctx = { clearRect: vi.fn(), fillRect: vi.fn() } as unknown as CanvasRenderingContext2D
    drawOverlay(ctx, emptyScene(), 0, 1080, 1920, true)
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 1080, 1920)
  })
})
