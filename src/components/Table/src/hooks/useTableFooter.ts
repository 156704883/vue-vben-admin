import { useEventListener } from '@vben/hooks';
import type { ComputedRef, Ref } from 'vue';
import { computed, h, nextTick, unref, watchEffect } from 'vue';

import TableFooter from '../components/TableFooter.vue';
import type { BasicTableProps } from '../types/table';

export function useTableFooter(
  propsRef: ComputedRef<BasicTableProps>,
  scrollRef: ComputedRef<{
    x: string | number | true;
    y: string | number | null;
    scrollToFirstRowOnChange: boolean;
  }>,
  tableElRef: Ref<ComponentRef>,
  getDataSourceRef: ComputedRef<Recordable>,
) {
  const getIsEmptyData = computed(() => {
    return (unref(getDataSourceRef) || []).length === 0;
  });

  const getFooterProps = computed((): Recordable | undefined => {
    const { summaryFunc, showSummary, summaryData } = unref(propsRef);
    return showSummary && !unref(getIsEmptyData)
      ? () => h(TableFooter, { summaryFunc, summaryData, scroll: unref(scrollRef) })
      : undefined;
  });

  watchEffect(() => {
    handleSummary();
  });

  function handleSummary() {
    const { showSummary } = unref(propsRef);
    if (!showSummary || unref(getIsEmptyData)) return;

    nextTick(() => {
      const tableEl = unref(tableElRef);
      if (!tableEl) return;
      const bodyDom = tableEl.$el.querySelector('.ant-table-content');
      useEventListener(bodyDom, 'scroll', () => {
        const footerBodyDom = tableEl.$el.querySelector(
          '.ant-table-footer .ant-table-content',
        ) as HTMLDivElement;
        if (!footerBodyDom || !bodyDom) {
          return;
        }
        footerBodyDom.scrollLeft = bodyDom.scrollLeft;
      });
    });
  }
  return { getFooterProps };
}
