<script lang="tsx">
  import { SearchOutlined } from '@vben/icons';
  import { Tooltip } from 'ant-design-vue';
  import { defineComponent, ref, unref } from 'vue';

  import { useI18n } from '@/hooks/web/useI18n';

  import AppSearchModal from './AppSearchModal.vue';

  export default defineComponent({
    name: 'AppSearch',
    setup() {
      const showModal = ref(false);
      const { t } = useI18n();

      function changeModal(show: boolean) {
        showModal.value = show;
      }

      return () => {
        return (
          <div class="p-1" onClick={changeModal.bind(null, true)}>
            <Tooltip>
              {{
                title: () => t('common.searchText'),
                default: () => <SearchOutlined />,
              }}
            </Tooltip>
            <AppSearchModal onClose={changeModal.bind(null, false)} visible={unref(showModal)} />
          </div>
        );
      };
    },
  });
</script>
