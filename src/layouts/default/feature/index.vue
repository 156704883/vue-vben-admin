<script lang="ts">
  import { BackTop } from 'ant-design-vue';
  import { computed, defineComponent, unref } from 'vue';

  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useUserStoreWithOut } from '@/store/modules/user';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import SessionTimeoutLogin from '@/views/sys/login/SessionTimeoutLogin.vue';

  export default defineComponent({
    name: 'LayoutFeatures',
    components: {
      BackTop,
      LayoutLockPage: createAsyncComponent(() => import('@/views/sys/lock/index.vue')),
      SettingDrawer: createAsyncComponent(() => import('@/layouts/default/setting/index.vue')),
      SessionTimeoutLogin,
    },
    setup() {
      const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
        useRootSetting();
      const userStore = useUserStoreWithOut();
      const { prefixCls } = useDesign('setting-drawer-feature');
      const { getShowHeader } = useHeaderSetting();

      const getIsSessionTimeout = computed(() => userStore.getSessionTimeout);

      const getIsFixedSettingDrawer = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return !unref(getShowHeader) || unref(getFullContent);
        }
        return settingButtonPosition === SettingButtonPositionEnum.FIXED;
      });

      return {
        getTarget: () => document.body,
        getUseOpenBackTop,
        getIsFixedSettingDrawer,
        prefixCls,
        getIsSessionTimeout,
      };
    },
  });
</script>

<template>
  <LayoutLockPage />
  <BackTop v-if="getUseOpenBackTop" :target="getTarget" />
  <SettingDrawer v-if="getIsFixedSettingDrawer" :class="prefixCls" />
  <SessionTimeoutLogin v-if="getIsSessionTimeout" />
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-drawer-feature';

  .@{prefix-cls} {
    display: flex;
    position: absolute;
    z-index: 10;
    top: 45%;
    right: 0;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 6px 0 0 6px;
    background-color: @primary-color;
    color: @white;
    cursor: pointer;

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
