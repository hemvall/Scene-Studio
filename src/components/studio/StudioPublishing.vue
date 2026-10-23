<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ContentProject, PublishingCopy } from '@/studio/content/project'
const props = defineProps<{ project: ContentProject }>()
const emit = defineEmits<{ (e: 'update', value: PublishingCopy): void }>()
const defaultCopy = (): PublishingCopy => ({
  instagram: "Il a demandé à l'IA d'analyser les réunions du CEO… et maintenant son agenda est vide. 😭\nLa dernière réponse de Lew est criminelle.\nEt toi, combien de réunions auraient pu être un mail ? 👇",
  tiktok: "POV : tu donnes ton calendrier à une IA 💀\n9 doublons. 3 mails déguisés. Le CEO n'était pas prêt.\nTeam réunion ou team mail ?",
  hashtags: ['#IA', '#HumourBureau', '#ChatGPT', '#Claude', '#Productivite', '#Lew'],
  coverTitle: 'IL A SUPPRIMÉ LES RÉUNIONS',
  coverSubtitle: '(AVEC L’IA)'
})
const copy = ref<PublishingCopy>({ ...defaultCopy(), ...props.project.metadata.publishing })
watch(() => props.project.id, () => { copy.value = { ...defaultCopy(), ...props.project.metadata.publishing } })
const hashtagsText = computed({
  get: () => copy.value.hashtags.join(' '),
  set: value => { copy.value.hashtags = value.split(/[\s,]+/).filter(Boolean).map(tag => tag.startsWith('#') ? tag : '#' + tag).slice(0, 30) }
})
const canvas = ref<HTMLCanvasElement>()
function save() { emit('update', structuredClone(copy.value)) }
async function copyText(value: string) { await navigator.clipboard.writeText(value) }
function downloadCover() {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920
  const ctx = c.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920)
  gradient.addColorStop(0, '#1b2336'); gradient.addColorStop(1, '#090b14')
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1920)
  ctx.fillStyle = '#9a83ff'; ctx.fillRect(75, 140, 930, 12)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 56px system-ui'; ctx.fillText('LEW  /  OFFICE AI', 80, 230)
  ctx.font = 'bold 82px system-ui'
  const words = copy.value.coverTitle.split(' '); let lines: string[] = []; let line = ''
  for (const word of words) {
    const next = line ? line + ' ' + word : word
    if (ctx.measureText(next).width > 900 && line) { lines.push(line); line = word } else line = next
  }
  if (line) lines.push(line)
  const start = 1000 - (lines.length * 96) / 2
  lines.forEach((text, i) => ctx.fillText(text, 80, start + i * 100))
  ctx.fillStyle = '#e7d642'; ctx.font = 'bold 76px system-ui'; ctx.fillText(copy.value.coverSubtitle, 80, start + lines.length * 100 + 30)
  ctx.fillStyle = '#c2c6d2'; ctx.font = '38px system-ui'; ctx.fillText('Quand ton agent IA lit ton agenda…', 80, 1720)
  const a = document.createElement('a'); a.download = 'lew-ai-meetings-cover-1080x1920.png'; a.href = c.toDataURL('image/png'); a.click()
}
</script>
<template>
  <section class="publish-pane">
    <header><h2>Publication · Instagram & TikTok</h2><p>Prépare les textes et la miniature avant de publier. Rien n’est publié automatiquement.</p></header>
    <label>Instagram Reels <textarea v-model="copy.instagram" rows="5" /></label>
    <button @click="copyText(copy.instagram + '\n' + copy.hashtags.join(' '))">Copier Instagram + hashtags</button>
    <label>TikTok <textarea v-model="copy.tiktok" rows="4" /></label>
    <button @click="copyText(copy.tiktok + '\n' + copy.hashtags.join(' '))">Copier TikTok + hashtags</button>
    <label>Hashtags <textarea v-model="hashtagsText" rows="2" /></label>
    <div class="publish-tips"><strong>Checklist avant publication</strong><p>9:16 · sous-titres lisibles · accroche dans les 2 premières secondes · couverture vérifiée sur mobile · question en légende. Les hashtags ne garantissent pas la viralité.</p></div>
    <label>Titre miniature <input v-model="copy.coverTitle" /></label>
    <label>Sous-titre miniature <input v-model="copy.coverSubtitle" /></label>
    <div class="publish-actions"><button @click="downloadCover">Télécharger miniature PNG 1080 × 1920</button><button class="primary" @click="save">Enregistrer au projet</button></div>
  </section>
</template>
<style scoped>
.publish-pane{padding:20px;overflow:auto;height:100%;display:flex;flex-direction:column;gap:14px;color:#e6e7ef;background:#13151f}.publish-pane header h2{font-size:17px;margin:0 0 5px}.publish-pane p{font-size:12px;color:#a8aabc;line-height:1.5}.publish-pane label{display:grid;gap:6px;font-size:12px;font-weight:650}.publish-pane textarea,.publish-pane input{background:#1c2030;border:1px solid #34394f;color:#f4f5fa;border-radius:9px;padding:11px;font:inherit;resize:vertical}.publish-pane button{background:#282d42;color:white;border:1px solid #444b66;padding:10px;border-radius:8px;cursor:pointer}.publish-pane .primary{background:#6653db}.publish-actions{display:grid;gap:8px}.publish-tips{background:#1c2030;border-radius:10px;padding:12px}
</style>