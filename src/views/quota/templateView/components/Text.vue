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
  import { reactive, ref } from 'vue';
  import { TextConfig } from '/#/template';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { Tinymce } from '/@/components/Tinymce/index';

  const props = defineProps<{
    config: TextConfig;
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
  const htmlStr = ref(props.config.text);
  // function edit() {}
  // function handleChange(s: string) {}
</script>

<style lang="less" scoped></style>
