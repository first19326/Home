import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ["vue"],
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                skipWaiting: true,
                clientsClaim: true,
                runtimeCaching: [{
                    urlPattern: /(.*?)\.(js|css|woff2|woff|ttf)/, // js / css 静态资源缓存
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'js-css-cache'
                    }
                }, {
                    urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'image-cache'
                    }
                }]
            },
            manifest: {
                name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
                short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
                description: loadEnv(mode, process.cwd()).VITE_SITE_DES,
                display: "standalone",
                start_url: "/",
                theme_color: "#424242",
                background_color: "#424242",
                icons: [{
                    src: "/image/icon/48.png",
                    sizes: "48x48",
                    type: "image/png"
                }, {
                    src: "/image/icon/72.png",
                    sizes: "72x72",
                    type: "image/png"
                }, {
                    src: "/image/icon/96.png",
                    sizes: "96x96",
                    type: "image/png"
                }, {
                    src: "/image/icon/128.png",
                    sizes: "128x128",
                    type: "image/png"
                }, {
                    src: "/image/icon/144.png",
                    sizes: "144x144",
                    type: "image/png"
                }, {
                    src: "/image/icon/192.png",
                    sizes: "192x192",
                    type: "image/png"
                }, {
                    src: "/image/icon/256.png",
                    sizes: "256x256",
                    type: "image/png"
                }, {
                    src: "/image/icon/512.png",
                    sizes: "512x512",
                    type: "image/png"
                }]
            }
        }),
        viteCompression()
    ],
    server: {
        port: "3000"
    },
    resolve: {
        alias: [{
            find: '@',
            replacement: resolve(__dirname, "src")
        }]
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false,
                additionalData: `@import "./src/style/global.scss";`
            }
        }
    },
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                // 生产环境时移除 console
                pure_funcs: ['console.log']
            }
        }
    }
})