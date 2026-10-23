import type { ContentLanguage } from '../audio/plan'
import { ContentStudio } from './api'
import { chatbotVsAgent } from './demo'
import type { CastMember, ContentProject } from './project'
/**
 * Ready-made reels for Lew's channel: one idea each, 15 to 30 seconds, English
 * first with a French version behind. They seed the library and sit behind
 * "New reel → Examples". Each is built through the same API as a generated project.
 */
export interface ExampleReel {
  id: string
  title: string
  topic: string
  hook: string
  cta: string
  template: string
  environment: ContentProject['environment']
  cast: CastMember[]
  tags: string[]
  duration?: number
  language?: ContentLanguage
  notes?: string
  script: Record<ContentLanguage, string>
}
const lew = (mark: string): CastMember => ({ role: 'lew', kind: 'lew', name: 'Lew', mark })
const ceo = (mark: string, name = 'CEO', role = 'ceo'): CastMember => ({ role, kind: 'ceo', name, mark })
const dev = (mark: string, name = 'Dev', role = 'dev'): CastMember => ({ role, kind: 'dev', name, mark })
export const EXAMPLE_REELS: ExampleReel[] = [
  {
    id: 'launch-meeting',
    title: '01 · Lew a supprimé les réunions',
    topic: 'Office comedy: the boss wants fewer meetings until he sees who created them',
    hook: "Mais Lew, pourquoi t’as supprimé toutes mes réunions ?",
    cta: 'La réunion aurait pu être un mail. Le mail aurait pu être Lew.',
    template: 'dev-joke',
    environment: 'meeting-room',
    language: 'fr',
    cast: [lew('head'), ceo('left')],
    tags: ['launch', 'humour', 'meetings', 'fr'],
    duration: 23,
    notes: "Episode 01, publication 16 octobre 2026. Fiction humoristique. Hook dès la première image, aucune intro ni logo animé. Patron sincèrement contrarié, Lew calme et impassible. Laisser respirer le regard caméra à 12.6s. Voix françaises à générer avant export ; les durées sont un montage cible, ajusté automatiquement aux clips. Couverture : IL A SUPPRIMÉ LES RÉUNIONS. Légende : On lui a demandé de nous faire gagner du temps. Il a commencé par le calendrier. Qui reconnaît son lundi matin ? #Lew #VieDeBureau #IA. Pas de promesse de viralité ni de démonstration produit : sketch fictif.",
    script: {
      fr: `[00:00]
CAMERA: two-shot Lew CEO
CEO (annoyed, 3s): "Mais Lew, pourquoi t’as supprimé toutes mes réunions ?"
[00:03.2]
CAMERA: close-up Lew
Lew looks at CEO.
LEW (deadpan, 2.6s): "Tu m’as demandé de supprimer les tâches inutiles."
[00:06.1]
CAMERA: close-up CEO
CEO (annoyed, 2.3s): "C’étaient des points de synchronisation."
[00:08.7]
CAMERA: close-up Lew
LEW (deadpan, 2.7s): "Pour préparer le point de préparation du point ?"
[00:11.7]
CAMERA: close-up CEO
CEO looks away.
CEO (neutral, 0.7s): "Exactement."
[00:12.6]
CAMERA: close-up Lew slow-push
Lew looks at camera.
[00:13.6]
CAMERA: close-up CEO
CEO (curious, 2.4s): "Bon. On fait une réunion pour en parler ?"
[00:16.3]
CAMERA: close-up Lew
Lew looks at CEO.
LEW (deadpan, 1.5s): "Je l’ai déjà supprimée."
[00:18.1]
CAMERA: close-up CEO
CEO looks confused.
CEO (confused, 1.8s): "Qui t’a donné les droits admin ?"
[00:20.3]
CAMERA: close-up Lew slow-push
Lew looks at CEO.
LEW (deadpan, 0.6s): "Toi."
[00:21.2]
Lew looks at camera.
`,
      en: `[00:00]
CAMERA: two-shot Lew CEO
CEO (annoyed, 3s): "Lew, why did you delete all my meetings?"
[00:03.2]
CAMERA: close-up Lew
Lew looks at CEO.
LEW (deadpan, 2.6s): "You asked me to remove pointless tasks."
[00:06.1]
CAMERA: close-up CEO
CEO (annoyed, 2.3s): "Those were alignment meetings."
[00:08.7]
CAMERA: close-up Lew
LEW (deadpan, 2.7s): "To prepare the meeting about preparing the meeting?"
[00:11.7]
CAMERA: close-up CEO
CEO looks away.
CEO (neutral, 0.7s): "Exactly."
[00:12.6]
CAMERA: close-up Lew slow-push
Lew looks at camera.
[00:13.6]
CAMERA: close-up CEO
CEO (curious, 2.4s): "Fine. Let's have a meeting about this."
[00:16.3]
CAMERA: close-up Lew
Lew looks at CEO.
LEW (deadpan, 1.5s): "Already deleted it."
[00:18.1]
CAMERA: close-up CEO
CEO looks confused.
CEO (confused, 1.8s): "Who gave you admin access?"
[00:20.3]
CAMERA: close-up Lew slow-push
Lew looks at CEO.
LEW (deadpan, 0.6s): "You."
[00:21.2]
Lew looks at camera.
`
    }
  },
  {
    id: 'launch-meeting-ai-remix',
    title: '01B · Lew a supprimé les réunions (AI remix)',
    topic: 'Office comedy: an AI agent cleans the calendar, then exposes the CEO as the source of pointless meetings',
    hook: 'Mais Lew, pourquoi mon calendrier est vide ?',
    cta: 'La réunion aurait pu être un mail. Le mail aurait pu être Lew.',
    template: 'dev-joke',
    environment: 'meeting-room',
    language: 'fr',
    cast: [lew('head'), ceo('left')],
    tags: ['launch', 'humour', 'meetings', 'ai', 'agents', 'fr'],
    duration: 29,
    notes: "Alternative to launch-meeting; original untouched. Visual direction: from frame one, put recognizable ChatGPT and Claude logos on a laptop screen or office posters (use licensed/approved logo assets if available), plus a funny wall sign: 'CHATGPT + CLAUDE : 2 IA / 0 RÉUNION QUI AURAIT DÛ ÊTRE UN MAIL'. Keep logos as set dressing, not an endorsement. Show a small AI AGENT / CALENDAR CLEANUP dashboard: '12 meetings reviewed / 9 duplicates / 3 could be emails / 0 deleted without permission'. At 'j’ai préparé', show draft cancellation cards awaiting CEO approval, not a magical uncontrolled calendar wipe. When CEO approves, animate calendar slots disappearing and one notification 'Réunion de crise sur les réunions — proposition détectée'. End on Lew's deadpan look. Production note: custom logos, poster, UI overlays and animated notifications are storyboard directions; they are not automatically created by this script compiler. Aim for quick cuts, reaction pause, dry humor; voice clips determine final timing.",
    script: {
      fr: `[00:00]
CAMERA: two-shot Lew CEO
CEO (confused, 2s): "Mais Lew, pourquoi mon calendrier est vide ?"
[00:02.3]
CAMERA: close-up Lew
Lew looks at laptop.
LEW (deadpan, 2.2s): "J’ai demandé à l’IA d’analyser tes réunions."
[00:04.8]
CAMERA: close-up CEO
CEO (curious, 1.1s): "Et alors ?"
[00:06.2]
CAMERA: close-up Lew
LEW (deadpan, 2.3s): "Neuf doublons. Trois mails déguisés."
[00:08.8]
CAMERA: close-up CEO
CEO looks confused.
CEO (annoyed, 1.7s): "C’était de l’alignement stratégique."
[00:10.8]
CAMERA: close-up Lew
LEW (deadpan, 2.1s): "Avec toi-même. Sur trois créneaux."
[00:13.2]
CAMERA: close-up CEO
CEO looks away.
PAUSE 0.5
CEO (neutral, 0.7s): "Ah."
[00:14.6]
CAMERA: medium Lew
LEW (deadpan, 2.5s): "J’ai préparé les annulations. Tu valides ?"
[00:17.4]
CAMERA: close-up CEO
CEO (neutral, 0.7s): "Vas-y."
[00:18.5]
CAMERA: close-up Lew
Lew nods.
LEW (deadpan, 1.1s): "C’est fait."
[00:20]
CAMERA: close-up CEO
CEO (curious, 2s): "On fait une réunion pour débriefer ?"
[00:22.3]
CAMERA: close-up Lew slow-push
Lew looks at CEO.
LEW (deadpan, 1.5s): "L’IA vient de la classer inutile."
[00:24.2]
CAMERA: close-up CEO
CEO looks confused.
CEO (confused, 1.4s): "Elle me connaît ?"
[00:26]
CAMERA: close-up Lew slow-push
Lew looks at camera.
LEW (deadpan, 1s): "Elle a ton agenda."
`,
      en: `[00:00]
CAMERA: two-shot Lew CEO
CEO (confused, 2s): "Lew, why is my calendar empty?"
[00:02.3]
CAMERA: close-up Lew
Lew looks at laptop.
LEW (deadpan, 2.2s): "I had AI review your meetings."
[00:04.8]
CAMERA: close-up CEO
CEO (curious, 1.1s): "And?"
[00:06.2]
CAMERA: close-up Lew
LEW (deadpan, 2.3s): "Nine duplicates. Three emails in disguise."
[00:08.8]
CAMERA: close-up CEO
CEO looks confused.
CEO (annoyed, 1.7s): "That was strategic alignment."
[00:10.8]
CAMERA: close-up Lew
LEW (deadpan, 2.1s): "With yourself. Three times."
[00:13.2]
CAMERA: close-up CEO
CEO looks away.
PAUSE 0.5
CEO (neutral, 0.7s): "Oh."
[00:14.6]
CAMERA: medium Lew
LEW (deadpan, 2.5s): "I drafted the cancellations. Approve?"
[00:17.4]
CAMERA: close-up CEO
CEO (neutral, 0.7s): "Go ahead."
[00:18.5]
CAMERA: close-up Lew
Lew nods.
LEW (deadpan, 1.1s): "Done."
[00:20]
CAMERA: close-up CEO
CEO (curious, 2s): "Should we meet to debrief?"
[00:22.3]
CAMERA: close-up Lew slow-push
Lew looks at CEO.
LEW (deadpan, 1.5s): "AI just flagged that as pointless."
[00:24.2]
CAMERA: close-up CEO
CEO looks confused.
CEO (confused, 1.4s): "Does it know me?"
[00:26]
CAMERA: close-up Lew slow-push
Lew looks at camera.
LEW (deadpan, 1s): "It has your calendar."
`
    }
  },
  {
  "id": "we-already-have-chatgpt",
  "title": "We already have ChatGPT",
  "topic": "ChatGPT versus an agent connected to your business systems",
  "hook": "Why would we need an AI agent? We already have ChatGPT.",
  "cta": "LEW — Agents that work.",
  "template": "misconception",
  "environment": "meeting-room",
  "cast": [
    {
      "role": "lew",
      "kind": "lew",
      "name": "Lew",
      "mark": "head"
    },
    {
      "role": "ceo",
      "kind": "ceo",
      "name": "CEO",
      "mark": "left"
    }
  ],
  "tags": [
    "agents",
    "business",
    "humour"
  ],
  "duration": 24.8,
  "notes": "Video 3. Revised comic pace: escalating short No responses, a silent 14.3–16.2s camera look, then Congratulations. Second punchline: Can it do this meeting? / Working on it. Iced latte within reach. Custom sipping, eyes-before-head motion, timed notification and LEW end card remain storyboard directions; they are not engine animations.",
  "script": {
    "en": "[00:00]\nCAMERA: two-shot Lew CEO\nLew goes deadpan.\nCEO (neutral, 1.7s): \"Why would we need an AI agent?\"\n[00:01.9]\nCAMERA: close-up Lew\nCEO (neutral, 1.5s): \"We already have ChatGPT.\"\n[00:03.4]\nLew looks at CEO.\nLew blinks.\n[00:03.6]\nLEW (deadpan, 0.45s): \"Okay.\"\n[00:04.2]\nLew leans forward.\nLEW (deadpan, 2.1s): \"Does it know what's happening in your CRM?\"\n[00:06.5]\nCEO (neutral, 0.35s): \"No.\"\n[00:07]\nLEW (deadpan, 0.6s): \"Your emails?\"\n[00:07.75]\nCEO (neutral, 0.35s): \"No.\"\n[00:08.3]\nCAMERA: close-up Lew slow-push\nLEW (deadpan, 0.7s): \"Support tickets?\"\n[00:09.2]\nCEO (neutral, 0.4s): \"…no.\"\n[00:09.8]\nLEW (deadpan, 1.1s): \"Can it update the CRM?\"\n[00:11]\nCEO (neutral, 0.35s): \"No.\"\n[00:11.5]\nCAMERA: two-shot Lew CEO\nLew looks at CEO.\nCEO looks at Lew.\n[00:11.9]\nLew looks at laptop.\n[00:12.1]\nLew looks at CEO.\nLEW (deadpan, 1.5s): \"Can it do anything without you?\"\n[00:13.9]\nCEO (neutral, 0.4s): \"…no.\"\n[00:14.3]\nCAMERA: close-up Lew slow-push\nLew looks at CEO.\n[00:15]\nLew looks at camera.\n[00:16.2]\nCAMERA: two-shot Lew CEO\nLew looks at CEO.\nLEW (deadpan, 1.2s): \"Then you have ChatGPT.\"\n[00:17.5]\nCEO nods.\n[00:17.8]\nLEW (deadpan, 0.75s): \"Congratulations.\"\n[00:19]\nCEO (confused, 0.65s): \"...thanks?\"\n[00:20]\nCEO looks at screen.\nLew looks at coffee.\n[00:20.4]\nCEO (neutral, 0.55s): \"…okay.\"\n[00:21.1]\nCEO looks at Lew.\nCEO (curious, 1.2s): \"Can it do this meeting?\"\n[00:22.7]\nCAMERA: close-up Lew\nLew looks at camera.\n[00:23]\nLEW (deadpan, 0.65s): \"Working on it.\"\n",
    "fr": "[00:00]\nCAMERA: two-shot Lew CEO\nLew goes deadpan.\nCEO (neutral, 1.7s): \"Pourquoi aurait-on besoin d'un agent IA ?\"\n[00:01.9]\nCAMERA: close-up Lew\nCEO (neutral, 1.5s): \"On a déjà ChatGPT.\"\n[00:03.4]\nLew looks at CEO.\nLew blinks.\n[00:03.6]\nLEW (deadpan, 0.45s): \"D'accord.\"\n[00:04.2]\nLew leans forward.\nLEW (deadpan, 2.1s): \"Il sait ce qui se passe dans votre CRM ?\"\n[00:06.5]\nCEO (neutral, 0.35s): \"Non.\"\n[00:07]\nLEW (deadpan, 0.6s): \"Vos emails ?\"\n[00:07.75]\nCEO (neutral, 0.35s): \"Non.\"\n[00:08.3]\nCAMERA: close-up Lew slow-push\nLEW (deadpan, 0.7s): \"Les tickets support ?\"\n[00:09.2]\nCEO (neutral, 0.4s): \"…non.\"\n[00:09.8]\nLEW (deadpan, 1.1s): \"Il peut mettre à jour le CRM ?\"\n[00:11]\nCEO (neutral, 0.35s): \"Non.\"\n[00:11.5]\nCAMERA: two-shot Lew CEO\nLew looks at CEO.\nCEO looks at Lew.\n[00:11.9]\nLew looks at laptop.\n[00:12.1]\nLew looks at CEO.\nLEW (deadpan, 1.5s): \"Il peut faire quelque chose sans vous ?\"\n[00:13.9]\nCEO (neutral, 0.4s): \"…non.\"\n[00:14.3]\nCAMERA: close-up Lew slow-push\nLew looks at CEO.\n[00:15]\nLew looks at camera.\n[00:16.2]\nCAMERA: two-shot Lew CEO\nLew looks at CEO.\nLEW (deadpan, 1.2s): \"Alors vous avez ChatGPT.\"\n[00:17.5]\nCEO nods.\n[00:17.8]\nLEW (deadpan, 0.75s): \"Félicitations.\"\n[00:19]\nCEO (confused, 0.65s): \"...merci ?\"\n[00:20]\nCEO looks at screen.\nLew looks at coffee.\n[00:20.4]\nCEO (neutral, 0.55s): \"…d'accord.\"\n[00:21.1]\nCEO looks at Lew.\nCEO (curious, 1.2s): \"Il peut faire cette réunion ?\"\n[00:22.7]\nCAMERA: close-up Lew\nLew looks at camera.\n[00:23]\nLEW (deadpan, 0.65s): \"J'y travaille.\"\n"
  }
},
  {
    id: 'rag-vector-db',
    title: 'RAG is not a vector database',
    topic: 'RAG is a retrieval system, not a storage choice',
    hook: 'CEO: We put all our docs in Pinecone.',
    cta: 'We build knowledge bases that answer right.',
    template: 'misconception',
    environment: 'office-night',
    cast: [lew('desk'), ceo('guest')],
    tags: ['rag', 'knowledge', 'explainer'],
    script: {
      en: `CAMERA: two-shot Lew CEO
CEO (happy): "We put all our documents in a vector database. We have RAG."

Lew looks at CEO.
CAMERA: medium Lew
LEW (deadpan): "Ask it which version of the contract is in force."

CAMERA: close-up CEO
CEO looks confused.
CEO: "It gave me a paragraph from 2021."

CAMERA: medium Lew
LEW: "Because it looks for sentences that sound alike. Not for the right answer."

CAMERA: close-up Lew slow-push
LEW (smug): "RAG is the sorting. The database is just the closet."
`,
      fr: `CAMERA: two-shot Lew CEO
CEO (content): "On a mis tous nos documents dans une base vectorielle. On a du RAG."

Lew regarde le CEO.
CAMERA: medium Lew
LEW (impassible): "Demandez-lui quelle version du contrat est en vigueur."

CAMERA: close-up CEO
Le CEO a l'air perdu.
CEO: "Il m'a sorti un paragraphe de 2021."

CAMERA: medium Lew
LEW: "Parce qu'il cherche des phrases qui ressemblent. Pas la bonne réponse."

CAMERA: close-up Lew slow-push
LEW (narquois): "Le RAG, c'est le tri. La base, c'est juste le placard."
`
    }
  },
  {
    id: 'ops-monday',
    title: "Ops' Monday morning",
    topic: 'Automating a weekly report with an agent',
    hook: 'Every Monday, Ops copies 200 tickets into a spreadsheet.',
    cta: 'Monday tasks belong to an agent.',
    template: 'before-after',
    environment: 'meeting-room',
    cast: [dev('left', 'Ops', 'ops'), lew('head')],
    tags: ['automation', 'ops', 'workflow'],
    script: {
      en: `CAMERA: medium Ops
OPS (tired): "Every Monday I copy the tickets into a spreadsheet, tag them, write the summary."

Ops sighs.
OPS: "Three hours. Minimum."

CAMERA: medium Lew
LEW: "The agent reads the tickets, tags them, writes the summary and posts it in Slack at eight."

CAMERA: close-up Ops
Ops looks surprised.
OPS: "And when it gets one wrong?"

CAMERA: close-up Lew slow-push
LEW (deadpan): "It shows you what it tagged. You fix it in two minutes."

PAUSE 0.3

LEW (smug): "Instead of three hours."
`,
      fr: `CAMERA: medium Ops
OPS (fatigué): "Chaque lundi je copie les tickets dans un tableur, je les tague, je fais le résumé."

Ops soupire.
OPS: "Trois heures. Minimum."

CAMERA: medium Lew
LEW: "L'agent lit les tickets, les tague, écrit le résumé et le poste sur Slack à huit heures."

CAMERA: close-up Ops
Ops a l'air surpris.
OPS: "Et s'il se trompe ?"

CAMERA: close-up Lew slow-push
LEW (impassible): "Il te montre ce qu'il a tagué. Tu corriges en deux minutes."

PAUSE 0.3

LEW (narquois): "Au lieu de trois heures."
`
    }
  },
  {
    id: 'rename-variable',
    title: 'Rename one variable',
    topic: 'An agent without guardrails does more than you asked',
    hook: 'Dev: I asked it to rename one variable.',
    cta: 'Agents that do what you asked. Nothing more.',
    template: 'dev-joke',
    environment: 'ai-lab',
    cast: [dev('left'), lew('right')],
    tags: ['humour', 'developers', 'agents'],
    script: {
      en: `CAMERA: medium Dev
DEV (tired): "I asked it to rename one variable."

PAUSE 0.3

DEV: "It refactored the module, added tests, and opened a PR titled 'Modernization'."

CAMERA: close-up Lew
Lew looks at Dev.
LEW (deadpan): "Do the tests pass?"

CAMERA: close-up Dev
Dev looks away.
DEV: "...they pass now."

CAMERA: two-shot Lew Dev slow-push
LEW (smug): "That's not an agent. That's an intern with admin rights."
`,
      fr: `CAMERA: medium Dev
DEV (fatigué): "Je lui ai demandé de renommer une variable."

PAUSE 0.3

DEV: "Il a refactoré le module, ajouté des tests, et ouvert une PR intitulée « Modernisation »."

CAMERA: close-up Lew
Lew regarde Dev.
LEW (impassible): "Les tests passent ?"

CAMERA: close-up Dev
Dev détourne le regard.
DEV: "…ils passent maintenant."

CAMERA: two-shot Lew Dev slow-push
LEW (narquois): "C'est pas un agent. C'est un stagiaire avec les droits admin."
`
    }
  },
  {
    id: 'mcp-explained',
    title: 'What is MCP?',
    topic: 'The Model Context Protocol explained with a USB plug',
    hook: 'Dev: Another protocol.',
    cta: 'We plug your tools into your agents, cleanly.',
    template: 'explainer',
    environment: 'ai-lab',
    cast: [lew('center'), dev('right')],
    tags: ['mcp', 'integrations', 'explainer'],
    script: {
      en: `CAMERA: two-shot Lew Dev
DEV (annoyed): "MCP. Another protocol."

Lew looks at Dev.
CAMERA: medium Lew
LEW: "Before, every tool had its own cable. One connector for Slack, one for the CRM, one for GitHub."

CAMERA: close-up Lew
LEW (deadpan): "MCP is the USB plug. The tool describes itself, the agent knows what to do with it."

CAMERA: close-up Dev
Dev looks curious.
DEV: "And what do I rewrite?"

CAMERA: close-up Lew slow-push
LEW (smug): "Nothing. That's the point."
`,
      fr: `CAMERA: two-shot Lew Dev
DEV (agacé): "MCP. Encore un protocole."

Lew regarde Dev.
CAMERA: medium Lew
LEW: "Avant, chaque outil avait son câble. Un connecteur pour Slack, un pour le CRM, un pour GitHub."

CAMERA: close-up Lew
LEW (impassible): "MCP, c'est la prise USB. L'outil se décrit, l'agent sait quoi en faire."

CAMERA: close-up Dev
Dev a l'air curieux.
DEV: "Et je réécris quoi ?"

CAMERA: close-up Lew slow-push
LEW (narquois): "Rien. C'est le but."
`
    }
  },
  {
    id: 'evals-demo',
    title: 'The demo that works once',
    topic: 'Without evals, an agent works in the demo and nowhere else',
    hook: 'CEO: The demo was perfect.',
    cta: 'We measure your agents before they ship.',
    template: 'business-pain',
    environment: 'meeting-room',
    cast: [ceo('right'), lew('head')],
    tags: ['evals', 'production', 'explainer'],
    script: {
      en: `CAMERA: medium CEO
CEO (happy): "The demo was perfect. Why does it fail with customers?"

CAMERA: medium Lew
Lew looks at CEO.
LEW (deadpan): "How many times did you test it?"

CAMERA: close-up CEO
CEO looks confused.
CEO: "Once. During the demo."

CAMERA: close-up Lew
LEW: "We run it through two hundred real cases. We count the ones it gets wrong. Then we do it again."

CAMERA: close-up Lew slow-push
LEW (smug): "That's called evals. Not luck."
`,
      fr: `CAMERA: medium CEO
CEO (content): "La démo était parfaite. Pourquoi ça rate chez les clients ?"

CAMERA: medium Lew
Lew regarde le CEO.
LEW (impassible): "Combien de fois vous l'avez testé ?"

CAMERA: close-up CEO
Le CEO a l'air perdu.
CEO: "Une fois. Pendant la démo."

CAMERA: close-up Lew
LEW: "On lui fait passer deux cents cas réels. On compte ceux qu'il rate. Et on recommence."

CAMERA: close-up Lew slow-push
LEW (narquois): "Ça s'appelle des evals. Pas de la chance."
`
    }
  },
  {
    id: 'context-engineering',
    title: 'Context engineering',
    topic: 'An agent is only as good as what you put in front of it',
    hook: 'Dev: The model is useless.',
    cta: 'The right context, at the right time. That is the job.',
    template: 'explainer',
    environment: 'office-night',
    cast: [dev('guest'), lew('desk')],
    tags: ['context', 'prompting', 'explainer'],
    script: {
      en: `CAMERA: two-shot Lew Dev
DEV (annoyed): "The model is useless. It makes up fields that don't exist."

Lew looks at Dev.
CAMERA: medium Lew
LEW (deadpan): "Did you show it the schema?"

CAMERA: close-up Dev
Dev looks away.
DEV: "It's in the docs."

CAMERA: medium Lew
LEW: "It doesn't read your docs. It reads what's in the window. The schema, three examples, the rule."

CAMERA: close-up Lew slow-push
LEW (smug): "The model is very good. The context was empty."
`,
      fr: `CAMERA: two-shot Lew Dev
DEV (agacé): "Le modèle est nul. Il invente des champs qui n'existent pas."

Lew regarde Dev.
CAMERA: medium Lew
LEW (impassible): "Tu lui as montré le schéma ?"

CAMERA: close-up Dev
Dev détourne le regard.
DEV: "Il est dans la doc."

CAMERA: medium Lew
LEW: "Il ne lit pas ta doc. Il lit ce qu'il y a dans la fenêtre. Le schéma, trois exemples, la règle."

CAMERA: close-up Lew slow-push
LEW (narquois): "Le modèle est très bon. Le contexte était vide."
`
    }
  },
  {
    id: 'sales-agent-11s',
    title: 'The sales agent in eleven seconds',
    topic: 'An agent that follows up dormant leads from the CRM',
    hook: 'Client: Can you follow up our dormant leads?',
    cta: 'A sales agent wired to your CRM, in a week.',
    template: 'agent-demo',
    environment: 'office-night',
    cast: [lew('desk'), ceo('guest', 'Client', 'client')],
    tags: ['sales', 'demo', 'product'],
    script: {
      en: `CAMERA: two-shot Lew Client
CLIENT: "Can you follow up the leads we haven't touched in two weeks?"

CAMERA: medium Lew
Lew looks at laptop.
LEW: "It's reading the CRM."

PAUSE 0.6

LEW: "Fourteen leads. Nine drafts. Three meetings proposed."

CAMERA: close-up Client
Client looks surprised.
CLIENT: "That took eleven seconds."

CAMERA: medium Lew slow-push
Lew looks at the camera.
LEW (smug): "And everything is logged. Ask your last intern for that."
`,
      fr: `CAMERA: two-shot Lew Client
CLIENT: "Vous pouvez relancer les prospects qu'on n'a pas touchés depuis deux semaines ?"

CAMERA: medium Lew
Lew regarde le laptop.
LEW: "Il lit le CRM."

PAUSE 0.6

LEW: "Quatorze prospects. Neuf brouillons. Trois rendez-vous proposés."

CAMERA: close-up Client
Le Client a l'air surpris.
CLIENT: "Ça a pris onze secondes."

CAMERA: medium Lew slow-push
Lew regarde la caméra.
LEW (narquois): "Et tout est journalisé. Demandez ça à votre dernier stagiaire."
`
    }
  },
  {
    id: 'poc-to-prod',
    title: 'Why your POC never ships',
    topic: 'Taking an agent to production: monitoring, cost, fallback',
    hook: 'CEO: The POC works. We ship Monday.',
    cta: 'We put your agents in production, not in a demo.',
    template: 'misconception',
    environment: 'meeting-room',
    cast: [ceo('right'), lew('head')],
    tags: ['production', 'orchestration', 'business'],
    script: {
      en: `CAMERA: medium CEO
CEO (happy): "The POC works. We ship Monday."

CAMERA: medium Lew
Lew looks at CEO.
LEW (deadpan): "What does it do when the CRM API goes down?"

CAMERA: close-up CEO
CEO looks confused.
CEO: "It goes down?"

CAMERA: close-up Lew
LEW: "And when the model takes twenty seconds? And when the bill triples?"

CAMERA: close-up CEO
CEO looks away.
CEO: "...we'll see Monday."

CAMERA: close-up Lew slow-push
LEW (smug): "A POC is an agent that never had a bad day."
`,
      fr: `CAMERA: medium CEO
CEO (content): "Le POC marche. On déploie lundi."

CAMERA: medium Lew
Lew regarde le CEO.
LEW (impassible): "Il fait quoi quand l'API du CRM tombe ?"

CAMERA: close-up CEO
Le CEO a l'air perdu.
CEO: "Elle tombe ?"

CAMERA: close-up Lew
LEW: "Et quand le modèle répond en vingt secondes ? Et quand la facture triple ?"

CAMERA: close-up CEO
Le CEO détourne le regard.
CEO: "…on verra lundi."

CAMERA: close-up Lew slow-push
LEW (narquois): "Un POC, c'est un agent qui n'a jamais eu de mauvaise journée."
`
    }
  }
]
export function buildExample(reel: ExampleReel, now = '2026-10-12T00:00:00.000Z', language: ContentLanguage = reel.language ?? 'en'): ContentProject {
  const other: ContentLanguage = language === 'en' ? 'fr' : 'en'
  const studio = ContentStudio.create({
    id: `example-${reel.id}`,
    now,
    title: reel.title,
    topic: reel.topic,
    hook: reel.hook,
    cta: reel.cta,
    language,
    format: 'reel',
    environment: reel.environment,
    template: reel.template,
    cast: reel.cast
  })
  studio.setScript(reel.script[language])
  studio.setAltScript(other, reel.script[other])
  studio.project.metadata.tags = [...reel.tags, 'example']
  if (reel.duration) studio.project.duration = reel.duration
  if (reel.notes) studio.project.metadata.notes = reel.notes
  studio.compileTimeline()
  return studio.project
}
/** The library's seed: the benchmark first, then the examples. */
export function exampleProjects(now?: string): ContentProject[] {
  return [chatbotVsAgent(undefined, now), ...EXAMPLE_REELS.map((r) => buildExample(r, now))]
}
