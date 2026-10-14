import { describe, expect, it } from 'vitest'
import { TEMPLATES } from './templates'
import { ContentStudio } from './api'
import { parseScript } from './script'
import { generationPrompt } from './generate'

describe('business content shelf', () => {
  it('instructs generation to demonstrate bounded business work without fabricated evidence', () => {
    const prompt = generationPrompt()
    expect(prompt).toContain('Never invent customer results, timings, counts or ROI')
    expect(prompt).toContain('reverse over-shoulder')
    expect(prompt).toContain('hook → pain → bounded demonstration → reaction pause → punchline')
    expect(prompt).toContain('Lew is calm, clever and subtly sarcastic')
    expect(prompt).toContain('CEO is confidently confused; Dev is tired')
  })

  it('offers orchestration, production evaluation and internal knowledge in both languages', () => {
    for (const id of ['orchestration', 'production-evaluation', 'internal-knowledge']) {
      expect(TEMPLATES.find(t => t.id === id), id).toBeDefined()
    }
  })

  it('gives every reusable script real varied coverage, a reaction pause and soft caption positioning', () => {
    for (const template of TEMPLATES) {
      const signatures: string[][] = []
      for (const language of ['en', 'fr'] as const) {
        const parsed = parseScript(template.script[language], template.cast)
        expect(parsed.warnings, `${template.id}/${language}`).toEqual([])
        expect(new Set(parsed.shots.map(s => s.type)).size, template.id).toBeGreaterThanOrEqual(4)
        expect(parsed.shots.some(s => s.type === 'over-shoulder'), template.id).toBe(true)
        expect(parsed.shots.some(s => s.type === 'profile'), template.id).toBe(true)
        expect(parsed.shots.some(s => s.movement === 'slow-push'), template.id).toBe(true)
        expect(template.script[language], template.id).toContain('PAUSE ')
        signatures.push(parsed.shots.map(s => `${s.type}:${s.target}:${s.other}:${s.movement}`))
        const studio = ContentStudio.fromTemplate(template.id, { language })
        expect(studio.project.hook, template.id).toBe(parsed.dialogue[0]!.text)
        expect(studio.project.cta.length, template.id).toBeGreaterThan(15)
        expect(studio.compileTimeline().warnings, template.id).toEqual([])
        expect(studio.project.scene.duration, template.id).toBeLessThan(40)
      }
      expect(signatures[0], template.id).toEqual(signatures[1])
    }
  })

  it('does not present invented demo speed or lead counts as evidence', () => {
    const script = TEMPLATES.find(t => t.id === 'agent-demo')!.script
    expect(script.en).not.toMatch(/Fourteen leads|eleven seconds|Three meetings proposed/i)
    expect(script.fr).not.toMatch(/Quatorze prospects|onze secondes|Trois rendez-vous proposés/i)
    expect(script.en).toMatch(/sample|illustrative|example/i)
    expect(script.fr).toMatch(/exemple|ficti|illustr/i)
  })
})
