import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const files: Writable<{[key: string]: string}> = writable({
  'frag.glsl': `void main() {
  gl_FragColor = vec4(1, 0, 0, 1);
}`,

  'vert.glsl': `attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}`
})

