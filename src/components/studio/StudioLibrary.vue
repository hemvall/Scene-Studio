<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'
import type { StudioDocument } from './useStudioDocument'
import { TEMPLATES } from '@/studio/content/templates'
import { EXAMPLE_REELS } from '@/studio/content/examples'
import { OUTPUT_PRESETS } from '@/studio/render/presets'
import { ENVIRONMENTS } from '@/studio/environments/catalog'
import { PROJECT_STATUSES, type ContentProject, type ProjectStatus } from '@/studio/content/project'
import { screenplayDialogue } from '@/studio/content/screenplay'
import { CHARACTERS, CHARACTER_KINDS } from '@/studio/characters/catalog'
import type { EnvironmentId } from '@/studio/scene/model'
import type { CastMember } from '@/studio/content/project'
import { parseScript } from '@/studio/content/script'
import { projectDuration } from '@/studio/content/compile'
const props = defineProps<{ studio: StudioDocument }>()
const { projects, generating, message, canGenerate, claude } = props.studio
const filter = ref<'all' | ProjectStatus>('all')
const search = ref('')
const sort = ref('recent')
const layout = ref<'grid' | 'list'>('grid')
const brief = ref('')
const menu = ref(false)
const keyOpen = ref(false)
const scriptOpen = ref(false)
const pastedScript = ref('')
const scriptTitle = ref('')
const scriptSet = ref<EnvironmentId>('office-night')
const scriptCast = ref<CastMember[]>([{role:'lew',name:'Lew',kind:'lew'}])
function detectCast() {
  const imported = screenplayDialogue(pastedScript.value)
  const names = imported.names.length ? imported.names : [...pastedScript.value.matchAll(/^([A-Z][A-Z _-]*)(?:\s*\([^)]*\))?:/gm)].map(m => m[1]!).filter(n => !['CAMERA','PAUSE'].includes(n))
  scriptCast.value = [...new Set(names)].map(name => ({name,role:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),kind: /lew/i.test(name) ? 'lew' : /dev|engineer/i.test(name) ? 'dev' : 'ceo'}))
}
const scriptError = ref('')
function createFromScript() {
  const imported = screenplayDialogue(pastedScript.value)
  const parsed = parseScript(imported.text, scriptCast.value)
  if (!parsed.dialogue.length || !scriptCast.value.length) {
    scriptError.value = parsed.warnings.join(' · ') || 'Use character-labelled dialogue, e.g. LEW: "Your line."'
    return
  }
  props.studio.newProject()
  props.studio.editProject(s => {
    s.setTitle(scriptTitle.value.trim() || 'My scripted reel')
    s.setEnvironment(scriptSet.value)
    s.project.cast = structuredClone(scriptCast.value.map(c => ({...c})))
    s.project.metadata.notes = pastedScript.value
    s.project.hook = parsed.dialogue[0]!.text
    s.project.cta = ''
    s.project.topic = ''
    delete s.project.scripts
    delete s.project.duration
  })
  props.studio.applyScriptText(imported.text)
  if (imported.storyboard) props.studio.message.value = 'Dialogue imported. Original screenplay saved in project notes. Screen montages, walking, title cards and music cuts still need staging; they were not automatically rendered.'
}
const voiceKeys = props.studio.audio.keys
function moveVoiceKey() {
  voiceKeys.value.elevenlabs = claude.value.apiKey.trim()
  claude.value.apiKey = ''
  message.value = 'Key moved to ElevenLabs voice settings. Open your reel → Script → Voice → ElevenLabs → Generate voices.'
}
const EXAMPLES = [
  'A 20-second Reel: a CEO asks Lew why they need an agent when they already have ChatGPT. Office at night, two-shot then close-ups, funny but accurate.',
  'Explain why "putting our docs in a vector database" is not RAG. Lew alone in the lab, 25 seconds, one punchline.',
  'A developer asks an AI to rename one variable and it refactors everything. Dev and Lew, 18 seconds.'
]
const visible = computed(() => {
  const list = filter.value === 'all' ? projects.value : projects.value.filter((p) => p.status === filter.value)
  const query = search.value.trim().toLocaleLowerCase()
  return list.filter(p => !query || [p.title, p.hook, p.topic, ...p.cast.map(c => c.name)].join(' ').toLocaleLowerCase().includes(query))
    .sort((a, b) => sort.value === 'title' ? a.title.localeCompare(b.title) : sort.value === 'oldest' ? a.metadata.updatedAt.localeCompare(b.metadata.updatedAt) : b.metadata.updatedAt.localeCompare(a.metadata.updatedAt))
})
const counts = computed(() => ({
  all: projects.value.length,
  draft: projects.value.filter((p) => p.status === 'draft').length,
  ready: projects.value.filter((p) => p.status === 'ready').length,
  rendered: projects.value.filter((p) => p.status === 'rendered').length
}))
function when(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const days = (Date.now() - d.getTime()) / 864e5
  if (days < 1) return 'today'
  if (days < 2) return 'yesterday'
  if (days < 7) return `${Math.floor(days)} days ago`
  return d.toLocaleDateString()
}
function seconds(p: ContentProject) {
  return `${(p.dialogue.length ? projectDuration(p) : p.scene.duration).toFixed(0)}s`
}
function submit() {
  const text = brief.value.trim()
  if (!text) return
  if (!claude.value.apiKey.trim().startsWith('sk-ant-')) {
    keyOpen.value = true
    message.value = 'Generate needs an Anthropic script key. Use the ElevenLabs field for voice keys.'
    return
  }
  props.studio.generate(text)
}
function outside(ev: PointerEvent) {
  if (!(ev.target as HTMLElement).closest('.menu')) menu.value = false
}
onMounted(() => window.addEventListener('pointerdown', outside))
onBeforeUnmount(() => window.removeEventListener('pointerdown', outside))
</script>
<template>
  <section class="library">
    <div v-if="scriptOpen" class="backdrop" @click.self="scriptOpen = false">
      <form class="dialog existing-script-dialog" role="dialog" aria-modal="true" aria-labelledby="existing-script-title" @submit.prevent="createFromScript">
        <header><h2 id="existing-script-title">From existing script</h2><button type="button" class="ghost" aria-label="Close script dialog" @click="scriptOpen = false"><Icon name="x" /></button></header>
        <p class="note">No Anthropic key needed. Paste dialogue, build the scene, then generate voices and render.</p>
        <label class="field-col">Reel title<input v-model="scriptTitle" aria-label="New reel title" placeholder="Name your reel" /></label>
        <label class="field-col">Set<select v-model="scriptSet" aria-label="Script set"><option v-for="env in Object.values(ENVIRONMENTS)" :key="env.id" :value="env.id">{{ env.name }}</option></select></label>
        <div class="script-cast"><strong>Cast</strong><button type="button" class="ghost" @click="detectCast">Detect characters from script</button><button type="button" class="ghost" @click="scriptCast.push({role:'character-' + scriptCast.length,name:'Character ' + (scriptCast.length+1),kind:'dev'})">Add character</button></div>
        <div v-for="(member,i) in scriptCast" :key="i" class="script-cast"><input v-model="member.name" :aria-label="'Script character ' + (i+1)" placeholder="Name in your script" @change="member.role = member.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')"/><select v-model="member.kind" :aria-label="'Appearance of ' + member.name"><option v-for="kind in CHARACTER_KINDS" :key="kind" :value="kind">{{ CHARACTERS[kind].name }}</option></select><button type="button" class="ghost" :aria-label="'Remove ' + member.name" @click="scriptCast.splice(i,1)"><Icon name="x"/></button></div>
        <label class="field-col">Your script<textarea v-model="pastedScript" aria-label="Existing script" placeholder='CAMERA: two-shot Lew CEO&#10;CEO: "We already have ChatGPT."&#10;LEW (deadpan): "Congratulations."' spellcheck="false" /></label>
        <p class="note">Paste NAME: "Dialogue" or a Markdown screenplay with character headings and quoted lines. Detect characters, choose their appearances and select your set. The full source is kept in project notes; screen montages, walking and title cards require staging.</p>
        <p v-if="scriptError" role="alert">{{ scriptError }}</p>
        <footer><span class="dim">Script → Scene → Voice → MP4</span><button type="submit" class="primary" :disabled="!pastedScript.trim()">Build scene</button></footer>
      </form>
    </div>
    <header class="library-head">
      <a href="/#" class="brand">Scene <span>Studio</span> <small>Creative workspace</small></a>
      <div class="spacer" />
      <button class="ghost" @click="scriptOpen = true"><Icon name="script" /> From existing script</button>
      <button class="ghost" title="Import a project or scene JSON" @click="studio.fileInput.value?.click()"><Icon name="import" /> Import</button>
      <span class="menu">
        <button class="primary" :aria-expanded="menu" @click="menu = !menu"><Icon name="plus" /> New reel</button>
        <div v-if="menu" class="menu-list">
          <button @click="menu = false; studio.newProject()"><Icon name="script" /> Blank · Lew alone</button>
          <button v-for="t in TEMPLATES" :key="t.id" @click="menu = false; studio.newProject(t.id)"><Icon name="film" /> {{ t.name }} <small>{{ t.duration }}s</small></button>
          <span class="menu-group">Examples</span>
          <button v-for="r in EXAMPLE_REELS" :key="r.id" @click="menu = false; studio.newFromExample(r.id)"><Icon name="reel" /> {{ r.title }} <small>{{ r.tags[0] }}</small></button>
        </div>
      </span>
    </header>
    <div class="library-intro"><div><p class="eyebrow">YOUR WORKSPACE</p><h1>A story starts here.</h1><p>Write, direct and render your next scene.</p></div><span class="library-total">{{ projects.length }} <small>reels in your library</small></span></div>
    <div class="composer-heading"><Icon name="wand" /><strong>From idea to scene</strong><span>Start with a brief or choose a template above.</span></div>
    <form class="command-bar" @submit.prevent="submit">
      <Icon name="wand" :size="18" />
      <input v-model="brief" type="text" placeholder="Describe your video… e.g. “25-second Reel: a CEO asks Lew why they need an agent when they already have ChatGPT”" aria-label="Video brief" :disabled="generating" />
      <button v-if="generating" type="button" class="ghost" @click="studio.cancelGenerate()"><Icon name="stop" /> Cancel</button>
      <button v-else type="submit" class="primary" :disabled="!brief.trim() || !canGenerate" :title="canGenerate ? 'Generate a project with Claude' : 'Needs an Anthropic API key'">
        <Icon name="sparkle" /> Generate
      </button>
      <button type="button" class="ghost icon-only" title="Provider settings" aria-label="Provider settings" :aria-expanded="keyOpen" @click="keyOpen = !keyOpen"><Icon name="settings" /></button>
    </form>
    <section v-if="keyOpen" class="key-panel provider-settings" aria-label="Provider settings">
      <h2>Provider settings</h2>
      <p class="note">Script generation and character voices use separate providers and keys.</p>
      <div class="provider-fields">
        <label class="field-col">ElevenLabs API key · character voices
          <input v-model="voiceKeys.elevenlabs" aria-label="ElevenLabs voice API key" type="password" autocomplete="off" spellcheck="false" placeholder="Paste your ElevenLabs key" />
          <small>Used only for voices. Sent only to api.elevenlabs.io.</small>
        </label>
        <label class="field-col">OpenAI API key · character voices
          <input v-model="voiceKeys.openai" aria-label="OpenAI voice API key" type="password" autocomplete="off" spellcheck="false" placeholder="Paste your OpenAI key" />
          <small>Used only for voices. Sent only to api.openai.com.</small>
        </label>
        <label class="field-col">Anthropic API key · script generation (optional)
          <input v-model="claude.apiKey" aria-label="Anthropic script API key" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" />
          <small>Used by Generate above, not for voices. Sent only to api.anthropic.com.</small>
        </label>
      </div>
      <p v-if="claude.apiKey && !claude.apiKey.trim().startsWith('sk-ant-')" class="note">This does not look like an Anthropic key. If you pasted your ElevenLabs key here, <button type="button" class="ghost" @click="moveVoiceKey">Move this key to ElevenLabs</button></p>
      <p class="note">Keys are saved in this browser. To add speech and lip sync: open a reel → Script → Voice, select ElevenLabs or OpenAI, then Generate voices. Anthropic is not required for voice generation.</p>
    </section>
    <p v-else-if="!canGenerate" class="note command-note">Generate needs an Anthropic script key. For speech, configure ElevenLabs in Provider settings; templates work without a script key.</p>
    <div v-if="generating" class="generating"><span /><span /><span /> Writing the project…</div>
    <p v-if="message" class="library-message">{{ message }}</p>
    <div v-if="!projects.length || projects.every((p) => !p.dialogue.length)" class="examples">
      <button v-for="e in EXAMPLES" :key="e" class="suggestion" :disabled="!canGenerate" @click="brief = e; submit()">{{ e }}</button>
    </div>
    <div class="library-tools"><h2>Reel library</h2><div class="spacer"/><input v-model="search" type="search" aria-label="Search reels" placeholder="Search title, topic or cast…"/><select v-model="sort" aria-label="Sort reels"><option value="recent">Recently edited</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select><div class="segmented" aria-label="Library layout"><button :class="{active:layout === 'grid'}" :aria-pressed="layout === 'grid'" @click="layout='grid'"><Icon name="library"/> Grid</button><button :class="{active:layout === 'list'}" :aria-pressed="layout === 'list'" @click="layout='list'"><Icon name="script"/> List</button></div></div>
    <nav class="filters" aria-label="Status filter">
      <button v-for="f in ['all', ...PROJECT_STATUSES] as const" :key="f" class="chip" :class="{ active: filter === f }" @click="filter = f">
        {{ f === 'all' ? 'All' : f === 'draft' ? 'Drafts' : f === 'ready' ? 'Ready' : 'Rendered' }} <small>{{ counts[f] }}</small>
      </button>
    </nav>
    <div class="cards" :class="{ 'cards-list': layout === 'list' }">
      <article v-for="p in visible" :key="p.id" class="card" :class="p.status">
        <button class="thumb" :style="{ background: ENVIRONMENTS[p.environment].background }" :title="`Open ${p.title}`" @click="studio.openProject(p.id)">
          <img v-if="p.metadata.thumbnail" :src="p.metadata.thumbnail" alt="" />
          <span v-else class="thumb-empty"><Icon name="scene" :size="32" /><strong>{{ ENVIRONMENTS[p.environment].name }}</strong><small>No preview yet · open to direct</small></span>
          <span class="thumb-format">{{ OUTPUT_PRESETS[p.format].aspect }} · {{ p.voice.language.toUpperCase() }}</span>
        </button>
        <div class="card-body">
          <h3>{{ p.title }}</h3>
          <p class="card-hook">{{ p.hook || p.topic || ENVIRONMENTS[p.environment].name }}</p>
          <p class="card-meta">
            <span>{{ seconds(p) }}</span> · <span>{{ OUTPUT_PRESETS[p.format].name }}</span> · <span>{{ p.cast.map((c) => c.name).join(', ') || 'no cast' }}</span>
          </p>
          <div class="card-actions">
            <select class="status" :value="p.status" :aria-label="`Status of ${p.title}`" @change="studio.openProject(p.id); studio.setStatus(($event.target as HTMLSelectElement).value as ProjectStatus); studio.view.value = 'library'">
              <option v-for="s in PROJECT_STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
            <span class="dim">{{ when(p.metadata.updatedAt) }}</span>
            <div class="spacer" />
            <button class="ghost icon-only" title="Duplicate" @click="studio.duplicateProject(p.id)"><Icon name="dup" /></button>
            <button class="ghost icon-only" title="Delete" @click="studio.deleteProject(p.id)"><Icon name="trash" /></button>
            <button class="primary" @click="studio.openProject(p.id)">Open</button>
          </div>
        </div>
      </article>
    </div>
    <div v-if="!visible.length" class="empty"><h2>{{ search ? 'No matching reels' : 'Your next scene awaits' }}</h2><p>{{ search ? 'Try another title, topic or character.' : 'Start a new reel or choose a different status.' }}</p><button v-if="search" class="ghost" @click="search = ''">Clear search</button></div>
  </section>
</template>
