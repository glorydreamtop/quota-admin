import { ref } from 'vue';
import { oneSentence } from '/@/api/cool';

export async function getSentence() {
  const str = ref('');

  str.value = await oneSentence();
}
