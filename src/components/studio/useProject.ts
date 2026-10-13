import { validateScene } from '@/studio/serialization/scene'
import { projectFromScene, serializeProject, validateProject, type ContentProject } from '@/studio/content/project'
import { ENVIRONMENTS } from '@/studio/environments/catalog'
import { exampleProjects } from '@/studio/content/examples'
/** Browser storage of the content library: a list of projects, validated on the way in. */
const KEY = 'scene-studio-library-v1'
const LEGACY_KEYS = ['scene-studio-project-v2', 'scene-studio-scene-v1']
export function loadLibrary(): { projects: ContentProject[]; active: string } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { projects?: unknown; active?: unknown }
      const projects = (Array.isArray(parsed.projects) ? parsed.projects : [])
        .map((p) => {
          try {
            const project = validateProject(p)
            if (project.environment === 'meeting-room') {
              const old: Record<string, number[]> = {tv:[0,1.55,-4.4],laptop:[0.1,0.79,-1.5],coffee:[0.9,0.79,-0.5]};
              for (const prop of project.scene.props) {
                const position = old[prop.id];
                if (position && prop.position.every((v,i) => Math.abs(v-position[i]!) < 0.0001)) {
                  const replacement = ENVIRONMENTS['meeting-room'].dressing.find(p => p.id === prop.id)!;
                  Object.assign(prop, structuredClone(replacement));
                }
              }
            }
            return project
          } catch {
            return null
          }
        })
        .filter((p): p is ContentProject => !!p)
      if (projects.length) {
        const active = projects.some((p) => p.id === parsed.active) ? String(parsed.active) : projects[0]!.id
        return { projects, active }
      }
    }
  } catch {
    /* storage is optional */
  }
  const projects: ContentProject[] = exampleProjects()
  // Scenes saved by the previous studio become script-less projects.
  for (const key of LEGACY_KEYS)
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as { entries?: { id?: unknown; scene?: unknown }[] }
      const scenes = Array.isArray(parsed.entries) ? parsed.entries.map((e) => e.scene) : [parsed]
      for (const s of scenes)
        try {
          projects.push(projectFromScene(validateScene(s)))
        } catch {
          /* skip a broken scene */
        }
    } catch {
      /* ignore */
    }
  return { projects, active: projects[0]!.id }
}
export function saveLibrary(projects: ContentProject[], active: string): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ projects: projects.map((p) => JSON.parse(serializeProject(p))), active }))
    return true
  } catch {
    return false
  }
}
