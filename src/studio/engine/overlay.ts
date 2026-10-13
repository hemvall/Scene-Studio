import type { SceneData } from '../scene/model'
import { drawSubtitles } from '../subtitles/draw'
import { SAFE_BOTTOM, SAFE_TOP } from '../subtitles/style'
/**
 * 2D layer composited over the 3D frame: subtitles, and editor guides.
 * Pure function of (scene, time, size), so the viewport and the video
 * exporter draw exactly the same thing.
 */
export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  scene: SceneData,
  time: number,
  width: number,
  height: number,
  editor = false,
  options: { clear?: boolean } = {}
) {
  // Preview owns a separate transparent layer; export already contains the 3D image.
  if (options.clear !== false) ctx.clearRect(0, 0, width, height)
  if (editor && height > width) {
    // Keep-out bands of the typical vertical-video UI.
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(0, 0, width, height * SAFE_TOP)
    ctx.fillRect(0, height * SAFE_BOTTOM, width, height * (1 - SAFE_BOTTOM))
  }
  const insert = scene.inserts?.find(i=>i.kind!=='label' && time>=i.start && time<i.end)
  if(insert) {
    ctx.save()
    ctx.fillStyle=insert.kind==='card'?'#000':'#10151c';ctx.fillRect(0,0,width,height)
    if(insert.kind==='card') {
      ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font=`500 ${width*.045}px "Segoe UI",sans-serif`
      insert.title.split('\n').forEach((line,i)=>ctx.fillText(line,width/2,height*.48+i*width*.075,width*.85))
    } else {
      const lines=insert.text.split('\n'), longest=Math.max(...lines.map(l=>l.length),20)
      const size=Math.min(width*.029,(width*.88)/(longest*.61),(height*.68)/lines.length)
      ctx.textAlign='left';ctx.fillStyle='#e8bf78';ctx.font=`600 ${width*.033}px "Segoe UI",sans-serif`
      ctx.fillText(insert.title,width*.06,height*.12,width*.88)
      ctx.fillStyle='#93a7bd';ctx.font=`400 ${width*.02}px monospace`;ctx.fillText('LEW / ENGINEERING WORKSPACE',width*.06,height*.08)
      ctx.font=`400 ${size}px monospace`
      lines.forEach((line,i)=>{ctx.fillStyle=i===Math.floor((time-insert.start)/(insert.end-insert.start)*lines.length)?'#e8bf78':'#dbe6f1';ctx.fillText(line,width*.06,height*.2+i*size*1.25)})
      ctx.fillStyle='#e8bf78';ctx.fillRect(width*.06,height*.9,width*.88*(time-insert.start)/(insert.end-insert.start),2)
    }
    ctx.restore();return
  }
  drawSubtitles(ctx, scene, time, width, height)
  const label=scene.inserts?.find(i=>i.kind==='label' && time>=i.start && time<i.end)
  if(label){ctx.save();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font=`600 ${width*.035}px "Segoe UI",sans-serif`;ctx.fillText(label.title,width/2,height*.18);ctx.restore()}
}
