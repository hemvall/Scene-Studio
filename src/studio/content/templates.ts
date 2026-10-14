import type { EnvironmentId, Expression } from '../scene/model'
import type { OutputFormat } from '../render/presets'
import type { ContentLanguage } from '../audio/plan'
import type { CastMember } from './project'
import { castMember } from './project'
import { EMOTION_LABELS } from './acting'

/** Reusable fictional sketches, not evidence of customer results. Replace the
 * workflow and dialogue, keep the hook → friction → demonstration → dry payoff.
 * Caption positioning stays outside the spoken punchline.
 */
export interface ContentTemplate {
  id: string
  name: string
  premise: string
  structure: string[]
  environment: EnvironmentId
  format: OutputFormat
  cast: CastMember[]
  duration: number
  script: Record<ContentLanguage, string>
  cta: Record<ContentLanguage, string>
  tags: string[]
}

type Beat = [speaker: string, english: string, french: string, emotion?: Expression]
interface Sketch {
  id: string
  name: string
  premise: string
  environment: EnvironmentId
  cast: CastMember[]
  tags: string[]
  beats: [Beat, Beat, Beat, Beat, Beat, Beat]
  cta: Record<ContentLanguage, string>
}
const officeCast = () => [castMember('lew', { mark: 'desk' }), castMember('ceo', { mark: 'guest' })]
const labCast = () => [castMember('lew', { mark: 'right' }), castMember('dev', { mark: 'left' })]
const meetingCast = () => [castMember('lew', { mark: 'head' }), castMember('ceo', { mark: 'right' })]

/** Camera tokens are the existing parser vocabulary. The shoulders reverse with
 * the speaker; the profile isolates the awkward admission; the two-shot reconnects
 * the practical answer. Only the payoff pushes in. No new animation machinery.
 */
function sketch(input: Sketch): ContentTemplate {
  const script = (language: ContentLanguage) => input.beats.map(([speaker, english, french, emotion], index) => {
    const other = input.cast.find(c => c.name.toLowerCase() !== speaker.toLowerCase())!.name
    const camera = [
      `wide ${speaker} slow-pan`,
      `over-shoulder ${speaker} ${other}`,
      `profile ${speaker}`,
      `two-shot ${speaker} ${other}`,
      `over-shoulder ${speaker} ${other}`,
      `close-up ${speaker} slow-push`
    ][index]
    const reaction = index === 4
      ? `${speaker} ${language === 'fr' ? 'détourne le regard.' : 'looks away.'}\nPAUSE 0.5\n`
      : ''
    return `CAMERA: ${camera}\n${reaction}${speaker.toUpperCase()}${emotion ? ` (${EMOTION_LABELS[emotion][language]})` : ''}: "${language === 'fr' ? french : english}"`
  }).join('\n\n') + '\n'
  return {
    id: input.id, name: input.name, premise: input.premise,
    structure: ['Wide hook: the confident claim', 'Over-shoulder: expose the friction', 'Profile: the admission', 'Two-shot: demonstrate a bounded workflow', 'Reverse shoulder and pause: let it land', 'Close-up slow push: dry payoff; soft positioning in the caption'],
    environment: input.environment, format: 'reel', cast: input.cast,
    duration: 28, tags: input.tags, cta: input.cta,
    script: { en: script('en'), fr: script('fr') }
  }
}

export const TEMPLATES: ContentTemplate[] = [
  sketch({
    id: 'misconception', name: 'AI misconception',
    premise: 'A vector database is not a complete internal knowledge workflow.',
    environment: 'office-night', cast: officeCast(), tags: ['explainer', 'rag', 'agents'],
    cta: { en: 'Lew AI Engineering: start with a question your team actually asks.', fr: 'Lew AI Engineering : commencez par une vraie question de votre équipe.' },
    beats: [
      ['CEO', 'We uploaded the documents. Knowledge solved.', 'On a importé les documents. Le savoir, réglé.', 'happy'],
      ['Lew', 'Which contract expires next month? Source included.', 'Quel contrat expire le mois prochain ? Avec la source.', 'deadpan'],
      ['CEO', 'It found the office lunch menu.', 'Il a trouvé le menu de la cantine.', 'confused'],
      ['Lew', 'Test retrieval, permissions and citations. Then test the answer.', "Testez la recherche, les droits et les citations. Puis la réponse."],
      ['CEO', 'So uploading was the easy part?', "Donc importer, c'était la partie facile ?", 'confused'],
      ['Lew', 'Yes. Even the lunch menu knew that.', 'Oui. Même la cantine était au courant.', 'deadpan']
    ]
  }),
  sketch({
    id: 'agent-demo', name: 'Agent demo',
    premise: 'Illustrative CRM follow-up workflow, with human approval and an audit trail.',
    environment: 'office-night',
    cast: [castMember('lew', { mark: 'desk' }), castMember('ceo', { role: 'client', name: 'Client', mark: 'guest' })],
    tags: ['demo', 'crm', 'integrations'],
    cta: { en: 'Bring Lew one workflow to prototype with sample data, then measure it.', fr: 'Proposez à Lew un workflow à prototyper sur des données fictives, puis à mesurer.' },
    beats: [
      ['Client', 'Can the agent chase our forgotten leads?', "L'agent peut relancer nos prospects oubliés ?"],
      ['Lew', 'Here is an example with sample CRM data.', 'Voici un exemple sur un CRM fictif.'],
      ['Client', 'Usually I copy everything into email.', "Normalement, je recopie tout dans un mail.", 'tired'],
      ['Lew', 'Read the CRM, draft the email, request approval, log it.', 'Lire le CRM, préparer le mail, demander validation, journaliser.'],
      ['Client', 'It does not just send everything?', "Il n'envoie pas tout directement ?", 'surprised'],
      ['Lew', 'No. Enthusiasm is not a permission model.', "Non. L'enthousiasme ne donne pas les droits d'accès.", 'deadpan']
    ]
  }),
  sketch({
    id: 'before-after', name: 'Before / after',
    premise: 'Replace support-ticket copying with a reviewable summary workflow.',
    environment: 'ai-lab', cast: labCast(), tags: ['automation', 'workflow', 'support'],
    cta: { en: 'Lew AI Engineering: map the handoffs before adding an agent.', fr: 'Lew AI Engineering : cartographiez les passages de relais avant d’ajouter un agent.' },
    beats: [
      ['Dev', 'My Monday is a human copy-paste API.', 'Le lundi, je suis une API de copier-coller.', 'tired'],
      ['Lew', 'Tickets into a spreadsheet, then Slack?', 'Les tickets dans un tableur, puis Slack ?', 'deadpan'],
      ['Dev', 'And someone asks where the summary went.', "Et quelqu'un demande où est passé le résumé.", 'tired'],
      ['Lew', 'Try ticket retrieval, tagged drafts, review, then Slack.', 'Essayons : tickets, brouillons classés, validation, puis Slack.'],
      ['Dev', 'And when a ticket is ambiguous?', 'Et quand un ticket est ambigu ?', 'curious'],
      ['Lew', 'Escalate. Not everything needs creative writing.', "On escalade. Tout ne mérite pas une rédaction créative.", 'deadpan']
    ]
  }),
  sketch({
    id: 'dev-joke', name: 'Developer joke',
    premise: 'A coding agent needs a bounded task and permissions, not blind trust.',
    environment: 'ai-lab', cast: labCast(), tags: ['humour', 'developers', 'tools'],
    cta: { en: 'Build bounded agents with Lew. Start with permissions and a test.', fr: 'Construisez des agents cadrés avec Lew. Commencez par les droits et un test.' },
    beats: [
      ['Dev', 'I asked it to rename one variable.', 'Je lui ai demandé de renommer une variable.', 'tired'],
      ['Lew', 'And gave it admin access?', 'Avec les droits admin ?', 'deadpan'],
      ['Dev', 'It redesigned the billing service.', 'Il a repensé le service de facturation.', 'tired'],
      ['Lew', 'Sandbox, scoped tools, tests, then approval.', 'Sandbox, outils limités, tests, puis validation.'],
      ['Dev', 'So less autonomy?', "Donc moins d'autonomie ?", 'confused'],
      ['Lew', 'Less surprise accounting.', 'Moins de comptabilité surprise.', 'deadpan']
    ]
  }),
  sketch({
    id: 'business-pain', name: 'Business pain',
    premise: 'Turn meeting notes into proposed CRM updates without promising instant results.',
    environment: 'meeting-room',
    cast: [castMember('lew', { mark: 'head' }), castMember('ceo', { role: 'sales', name: 'Sales', mark: 'right' })],
    tags: ['sales', 'automation', 'integrations'],
    cta: { en: 'Lew connects the workflow, not just another chat window.', fr: 'Lew relie le workflow, pas seulement une fenêtre de chat de plus.' },
    beats: [
      ['Sales', 'The call ended. My second job starts.', "L'appel est fini. Mon deuxième métier commence."],
      ['Lew', 'CRM, follow-up, calendar?', 'CRM, relance, agenda ?', 'deadpan'],
      ['Sales', 'Same notes. Different tabs. Every time.', 'Mêmes notes. Autres onglets. À chaque fois.', 'tired'],
      ['Lew', 'Draft CRM updates from approved notes. Review before writing.', 'Préparer le CRM depuis les notes validées. Vérifier avant écriture.'],
      ['Sales', 'Where is the magic?', 'Elle est où, la magie ?', 'confused'],
      ['Lew', 'Mostly in not opening another tab.', 'Surtout dans le fait de ne pas ouvrir un autre onglet.', 'deadpan']
    ]
  }),
  sketch({
    id: 'explainer', name: 'Technical explanation',
    premise: 'Distinguish an agent workflow from a chatbot without claiming self-checks guarantee correctness.',
    environment: 'meeting-room', cast: meetingCast(), tags: ['explainer', 'concepts', 'agents'],
    cta: { en: 'Lew AI Engineering: choose the workflow before choosing the framework.', fr: 'Lew AI Engineering : choisissez le workflow avant le framework.' },
    beats: [
      ['CEO', 'We renamed the chatbot. It is an agent.', "On a renommé le chatbot. C'est un agent.", 'happy'],
      ['Lew', 'What can it actually do?', "Il peut faire quoi, concrètement ?", 'deadpan'],
      ['CEO', 'Answer. In a more expensive font.', 'Répondre. Avec une police plus chère.', 'confused'],
      ['Lew', 'An agent uses tools toward a goal. Validate its outputs.', 'Un agent utilise des outils vers un objectif. Vérifiez ses sorties.'],
      ['CEO', 'The font does not count?', 'La police ne compte pas ?', 'confused'],
      ['Lew', 'Only for the invoice.', 'Seulement sur la facture.', 'deadpan']
    ]
  }),
  sketch({
    id: 'orchestration', name: 'Agent orchestration',
    premise: 'Show routing, bounded specialists, shared state and approval rather than a crowd of chatbots.',
    environment: 'meeting-room', cast: meetingCast(), tags: ['orchestration', 'agents', 'workflow'],
    cta: { en: 'Lew AI Engineering: design the handoffs, owners and failure paths first.', fr: 'Lew AI Engineering : définissez les relais, les responsables et les chemins d’échec.' },
    beats: [
      ['CEO', 'I hired a team of agents.', "J'ai recruté une équipe d'agents.", 'happy'],
      ['Lew', 'Who owns the next step?', 'Qui est responsable de la suite ?', 'deadpan'],
      ['CEO', 'They keep asking each other.', 'Ils se renvoient la question.', 'confused'],
      ['Lew', 'Route the task. Share state. Bound retries. Approve writes.', 'Router la tâche. Partager l’état. Limiter les tentatives. Valider les écritures.'],
      ['CEO', 'So they need a workflow?', 'Donc il leur faut un workflow ?', 'confused'],
      ['Lew', 'Otherwise you automated the meeting.', 'Sinon, vous avez automatisé la réunion.', 'deadpan']
    ]
  }),
  sketch({
    id: 'production-evaluation', name: 'Demo to production',
    premise: 'Use representative evaluations, traces, budgets and rollback before releasing an agent.',
    environment: 'ai-lab', cast: labCast(), tags: ['evaluation', 'production', 'observability'],
    cta: { en: 'Lew takes the boring parts seriously: evaluations, integrations and production.', fr: 'Lew prend le travail invisible au sérieux : évaluations, intégrations et production.' },
    beats: [
      ['Dev', 'The demo passed. Can I sleep?', 'La démo marche. Je peux dormir ?', 'tired'],
      ['Lew', 'What happens when the API times out?', "Et si l'API ne répond pas ?", 'deadpan'],
      ['Dev', 'The demo did not have that slide.', "La démo n'avait pas cette diapo.", 'tired'],
      ['Lew', 'Test real cases. Trace failures. Set budgets and rollback.', 'Tester des cas réels. Tracer les échecs. Prévoir budgets et rollback.'],
      ['Dev', 'And then we measure the results?', 'Et ensuite, on mesure les résultats ?', 'curious'],
      ['Lew', 'Yes. Applause is not monitoring.', "Oui. Les applaudissements ne sont pas du monitoring.", 'deadpan']
    ]
  }),
  sketch({
    id: 'internal-knowledge', name: 'Internal knowledge assistant',
    premise: 'A useful internal RAG assistant cites current permitted sources and admits missing evidence.',
    environment: 'office-night', cast: officeCast(), tags: ['rag', 'knowledge', 'permissions'],
    cta: { en: 'Lew builds internal assistants around your sources, access rules and real questions.', fr: 'Lew construit les assistants internes autour de vos sources, droits et vraies questions.' },
    beats: [
      ['CEO', 'Our assistant knows the entire company.', 'Notre assistant connaît toute l’entreprise.', 'happy'],
      ['Lew', 'Can everyone read the salary folder?', 'Tout le monde peut lire le dossier des salaires ?', 'deadpan'],
      ['CEO', 'Please say that is hypothetical.', 'Dites-moi que c’est une hypothèse.', 'confused'],
      ['Lew', 'Filter by access. Cite current sources. Abstain without evidence.', 'Filtrer par droits. Citer les sources à jour. S’abstenir sans preuve.'],
      ['CEO', 'Even if it sounds confident?', 'Même s’il a l’air sûr de lui ?', 'confused'],
      ['Lew', 'Especially then. We already have executives.', 'Surtout là. On a déjà des dirigeants.', 'deadpan']
    ]
  })
]

export function findTemplate(id: string) {
  return TEMPLATES.find(t => t.id === id)
}
