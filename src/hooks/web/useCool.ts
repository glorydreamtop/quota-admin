import { ref } from 'vue';
import { oneSentence } from '/@/api/cool';
import lottie from 'lottie-web';

export async function getSentence() {
  const str = ref('');

  str.value = await oneSentence();
}

interface lottieParams {
  container: Element;
  loop: boolean;
  autoplay: boolean;
  render?: 'svg' | 'canvas';
  path: string;
}
export function useLottie({ container, loop, autoplay, path }: lottieParams) {
  const anim = lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop,
    autoplay,
    path,
  });
  return anim;
}
