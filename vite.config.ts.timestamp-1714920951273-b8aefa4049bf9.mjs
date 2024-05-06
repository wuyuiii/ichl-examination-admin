// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/vite@5.1.1_@types+node@20.11.17_sass@1.70.0/node_modules/vite/dist/node/index.js";
import vue from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.1_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Icons from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/resolver.js";
import AutoImport from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/unplugin-auto-import@0.17.5_@vueuse+core@10.9.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/resolvers.js";
import Inspect from "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/node_modules/.pnpm/vite-plugin-inspect@0.8.3_vite@5.1.1/node_modules/vite-plugin-inspect/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///G:/%E5%89%8D%E7%AB%AF/Vue3%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F/ichl-admin/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon"
        })
      ]
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ]
    }),
    Icons({ autoInstall: true }),
    Inspect()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxcdTUyNERcdTdBRUZcXFxcVnVlM1x1ODAwM1x1OEJENVx1N0NGQlx1N0VERlxcXFxpY2hsLWFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxcdTUyNERcdTdBRUZcXFxcVnVlM1x1ODAwM1x1OEJENVx1N0NGQlx1N0VERlxcXFxpY2hsLWFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi8lRTUlODklOEQlRTclQUIlQUYvVnVlMyVFOCU4MCU4MyVFOCVBRiU5NSVFNyVCMyVCQiVFNyVCQiU5Ri9pY2hsLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgSW5zcGVjdCBmcm9tICd2aXRlLXBsdWdpbi1pbnNwZWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gVnVlLCBlLmcuIHJlZiwgcmVhY3RpdmUsIHRvUmVmLi4uXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxuICAgICAgaW1wb3J0czogWyd2dWUnXSxcblxuICAgICAgLy8gQXV0byBpbXBvcnQgZnVuY3Rpb25zIGZyb20gRWxlbWVudCBQbHVzLCBlLmcuIEVsTWVzc2FnZSwgRWxNZXNzYWdlQm94Li4uICh3aXRoIHN0eWxlKVxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcblxuICAgICAgICAvLyBBdXRvIGltcG9ydCBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIHByZWZpeDogJ0ljb24nXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgLy8gQXV0byByZWdpc3RlciBpY29uIGNvbXBvbmVudHNcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddXG4gICAgICAgIH0pLFxuICAgICAgICAvLyBBdXRvIHJlZ2lzdGVyIEVsZW1lbnQgUGx1cyBjb21wb25lbnRzXG4gICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3RUM0XHU0RUY2XG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKVxuICAgICAgXVxuICAgIH0pLFxuICAgIEljb25zKHsgYXV0b0luc3RhbGw6IHRydWUgfSksXG4gICAgSW5zcGVjdCgpXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFULFNBQVMsZUFBZSxXQUFXO0FBRXhWLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxhQUFhO0FBVDZJLElBQU0sMkNBQTJDO0FBWWxOLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQTtBQUFBO0FBQUEsTUFHVCxTQUFTLENBQUMsS0FBSztBQUFBO0FBQUE7QUFBQSxNQUlmLFdBQVc7QUFBQSxRQUNULG9CQUFvQjtBQUFBO0FBQUE7QUFBQSxRQUlwQixjQUFjO0FBQUEsVUFDWixRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBO0FBQUE7QUFBQSxRQUdULGNBQWM7QUFBQSxVQUNaLG9CQUFvQixDQUFDLElBQUk7QUFBQSxRQUMzQixDQUFDO0FBQUE7QUFBQTtBQUFBLFFBR0Qsb0JBQW9CO0FBQUEsTUFDdEI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU0sRUFBRSxhQUFhLEtBQUssQ0FBQztBQUFBLElBQzNCLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
