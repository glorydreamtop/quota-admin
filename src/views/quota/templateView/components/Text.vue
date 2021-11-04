<template>
  <div class="h-full p-4">
    <Tinymce
      v-model:value="htmlStr"
      @change="handleChange"
      width="100%"
      :options="options"
      :showImageUpload="false"
    />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, toRefs } from 'vue';
  import { TextConfig } from '/#/template';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { Tinymce } from '/@/components/Tinymce/index';

  const props = defineProps<{
    config: TextConfig;
  }>();
  const emit = defineEmits<{
    (event: 'update:config', config: TextConfig): void;
  }>();
  // const { t } = useI18n();
  const options = reactive({
    elementpath: false,
    toolbar: false,
    menubar: false,
    plugins: ['quickbars'],
    resize: false,
    inline: true,
    statusbar: false,
    quickbars_selection_toolbar:
      'bold italic underline lineheight alignleft aligncenter alignright fontsizeselect indent outdent removeformat',
  });
  const { config } = toRefs(props);
  const htmlStr = ref(config.value.text);
  // function edit() {}
  function handleChange(s: string) {
    console.log(s);

    emit('update:config', { text: s });
  }
</script>

<style lang="less" scoped></style>
