import type { CastMember, DialogueLine, Shot } from '../content/project'
import type { ShotType } from '../camera/shots'

/** Deterministic editorial coverage used only when the author supplied no shots.
 * Reverse shoulders follow the current speaker; quiet gaps belong to the listener.
 * No camera or animation API extension is needed: these are ordinary compiled shots.
 */
export function automaticShots(dialogue: DialogueLine[], cast: CastMember[]): Shot[] {
  const lines = [...dialogue].filter(d => cast.some(c => c.role === d.speaker)).sort((a, b) => a.start - b.start)
  const shots: Shot[] = []
  for (const [index, line] of lines.entries()) {
    const previous = lines[index - 1]
    const other = cast.find(c => c.role === (previous?.speaker !== line.speaker ? previous?.speaker : undefined))?.role
      ?? cast.find(c => c.role !== line.speaker)?.role
    const types: ShotType[] = other
      ? ['wide', 'over-shoulder', 'over-shoulder', 'profile', 'two-shot', 'close-up']
      : ['wide', 'medium', 'profile', 'close-up']
    const last = index === lines.length - 1
    shots.push({
      id: `s-auto-${index}`, target: line.speaker, ...(other && { other }),
      type: last ? 'close-up' : types[index % types.length]!,
      start: line.start, duration: line.duration,
      movement: last ? 'slow-push' : index % types.length === 4 ? 'slow-pan' : 'static'
    })
    const next = lines[index + 1]
    const end = line.start + line.duration
    if (other && next && next.start - end >= 0.65) {
      shots.push({ id: `s-reaction-${index}`, target: other, type: 'close-up', start: Math.round((end + 0.12) * 100) / 100, movement: 'static' })
    }
  }
  return shots
}
