import { resolve } from 'node:path';

import dayjs from 'dayjs';
import { readPackageJSON } from 'pkg-types';
import { presetTypography, presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';

import { createPlugins } from '../plugins';
import { generateModifyVars } from '../utils/modifyVars';
import { commonConfig } from './common';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {
    //
  };
}

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(mode, root);

    const defineData = await createDefineData(root);
    const plugins = await createPlugins({
      isBuild,
      root,
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      enableMock: VITE_USE_MOCK === 'true',
      compress: VITE_BUILD_COMPRESS,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);

    const applicationConfig: UserConfig = {
      esbuild: {
        drop: isBuild ? ['console', 'debugger'] : [],
      },
      resolve: {
        alias: [
          {
            find: 'vue',
            replacement: 'vue/dist/vue.runtime.esm-bundler.js',
          },
          {
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
          },
          // @/xxxx => src/xxxx
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: pathResolve('types') + '/',
          },
        ],
      },
      define: defineData,
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/_entry-[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router'],
              icon: ['@purge-icons/generated', 'virtual:svg-icons-register'],
            },
          },
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: generateModifyVars(),
            javascriptEnabled: true,
          },
        },
      },
      plugins: [
        ...plugins,
        UnoCSS({
          exclude: ['node_modules'],
          include: ['**.ts', '**.tsx', '**.vue'],
          presets: [presetUno(), presetTypography()],
        }),
      ],
    };

    const mergedConfig = mergeConfig(commonConfig, applicationConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    };
  } catch (error) {
    return {};
  }
}

export { defineApplicationConfig };
