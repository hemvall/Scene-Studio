# Scene Studio

## Frontend design

Read and use [.agents/skills/taste-skill/SKILL.md](.agents/skills/taste-skill/SKILL.md) for frontend design and visual polish. This is the design-taste-frontend skill from Leonxlnx/taste-skill.

Apply its guidance in the context of this product. Scene Studio is a desktop creative editor, with a dark, compact interface, a large realtime viewport, contextual inspector and timeline. Preserve its established visual identity and working controls. Prefer clear hierarchy, consistent spacing and typography, restrained motion, accessible contrast and complete interaction states.

The existing stack is Vue 3, TypeScript, Vite and Three.js. Keep the UI separate from the deterministic scene engine. The skill's marketing-page examples and React/Next.js/Tailwind defaults do not override this stack or the studio layout. Do not add dependencies solely to match those examples or replace the application with a landing page. Audit the existing interface before making targeted design changes.

For application changes, run pnpm typecheck, pnpm test and pnpm build. Verify visual changes in the browser and inspect actual exported frames when touching rendering or capture.
