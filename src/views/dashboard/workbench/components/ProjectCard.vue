<template>
  <Card title="项目" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>

    <CardGrid v-for="item in items" :key="item.title" class="!md:w-1/3 !w-full">
      <span class="flex">
        <VbenIcon :icon="item.icon" :color="item.color" :size="30" />
        <span class="text-lg ml-4">{{ item.title }}</span>
      </span>
      <div class="flex mt-2 h-10 text-secondary">{{ item.desc }}</div>
      <div class="flex justify-between text-secondary">
        <span>{{ item.group }}</span>
        <span>{{ item.date }}</span>
      </div>
    </CardGrid>
  </Card>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { Card, CardGrid } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { groupItems } from './data';

  export default defineComponent({
    components: { Card, CardGrid, VbenIcon },
    setup() {
      return { items: groupItems };
    },
  });
</script>
