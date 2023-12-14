/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-07-12 16:59:26
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-21 18:06:37
 * @FilePath: \tp-editor\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as Vue from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import * as G2Plot from '@antv/g2plot'
import * as dayjs from 'dayjs'
import * as axios from 'axios'
import * as ElementPlus from 'element-plus'
import * as echarts from 'echarts'
import TpColorPicker from "@/plugins/tp-plugin/components/TpColorPicker.vue";
// 第三方插件
import * as Plugins from './dependence';
import * as Global from '@/utils/global'


import 'systemjs'
System.set('lib:vue', Vue)
System.set('lib:element-plus', ElementPlus)
System.set('lib:@antv/g2plot', G2Plot)
System.set('lib:dayjs', dayjs)
System.set('lib:axios', axios)
System.set('lib:echarts', echarts)

const app = createApp(App);
// 全局方法
Global.install(app);

app.component('tp-color-picker', TpColorPicker);
// 使用 Element Plus
Plugins.installElementPlus(app);
Plugins.installEchart(app);
// 使用AMap
Plugins.installAMap(app);
Plugins.installDataV(app);


app.use(router);
app.use(createPinia());

router.isReady().then(() => app.mount('#app'));
