<template>
  <MenuItem :key="item.path">
    <MenuItemContent v-bind="$props" :item="item" />
  </MenuItem>
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { itemProps } from '../props';
  import MenuItemContent from './MenuItemContent.vue';

  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuItemContent },
    props: itemProps,
    setup() {
      return {};
    },
  });
</script>
