<template>
  <div>
    <el-tabs v-model="data.activeName" class="market-tabs" type="border-card" @tab-change="getPlugins">
      <el-tab-pane label="组件" name="plugin">
        <div class="p-4 h-[calc(100%_-_48px)] overflow-y-auto">
          <div class="flex justify-between">
            <el-form inline>
              <el-form-item label="插件名">
                <el-input placeholder="回车搜索" v-model="data.keyword" @keydown.enter="keydown" />
              </el-form-item>
              <el-form-item label="已安装">
                <el-checkbox v-model="data.installed" @change="data.page = 1; getPlugins()" />
                <span class="mr-4">
                  <el-badge :value="data.waitingUpdateTotal" type="warning" v-if="data.waitingUpdateTotal > 0">
                    <span class="text-sm text-gray-500">
                      待更新
                    </span>
                  </el-badge>
                </span>
              </el-form-item>
            </el-form>
            <div>
              <el-button :icon="HelpFilled" @click="data.openMine = true" type="primary">
                发布插件
              </el-button>
            </div>
          </div>
          <el-table :data="data.list" @expand-change="expand">
            <el-table-column type="expand">
              <template #default="props">
                <div class="pl-10 pr-4 mt-4">
                  <div class="flex text-sm mb-4">
                    <span>插件描述：</span>
                    <div class="flex-1 ml-2" v-html="props.row.description"></div>
                  </div>
                  <el-table size="small" max-height="250" :data="data.historyMap.get(props.row.id)?.list || []">
                    <el-table-column label="版本号" prop="version">
                      <template #default="scope">
                        <el-tag>{{ scope.row.version }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="发布说明">
                      <template #default="scope">
                        <el-popover title="发布说明" :width="400" trigger="click">
                          <template #reference>
                            <el-button type="primary" size="small" link>查看</el-button>
                          </template>
                          <div class="whitespace-pre">
                            {{ scope.row.releaseNote }}
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column label="发布时间">
                      <template #default="scope">
                        {{ dayjs(scope.row.created).format('YYYY-MM-DD HH:mm') }}
                      </template>
                    </el-table-column>
                    <el-table-column label="状态">
                      <template #default="{ row }">
                        <el-tag :type="row.state === 'passed' ? 'success' : 'warning'">{{ row.state === 'passed' ? '正常' :
                          '待审核' }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="安装">
                      <template #default="{ row }">
                        <el-button size="small" type="primary" v-if="!row.installed" @click="install(row.id)">
                          安装
                        </el-button>
                        <div v-else>已安装</div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="mt-2 justify-end flex" v-if="data.historyMap.get(props.row.id)?.total > 10">
                    <el-pagination layout="prev, pager, next" small @current-change="e => pageChange(props.row.id, e)"
                      :total="data.historyMap.get(props.row.id)?.total || 0"
                      :model-value="data.historyMap.get(props.row.id)?.page || 0"
                      :page-size="data.historyMap.get(props.row.id)?.pageSize || 10" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70">
              <template #default="scope">
                <img :src="`${oss}/${scope.row.icon}`" class="w-10 h-10" />
              </template>
            </el-table-column>
            <el-table-column label="插件名" prop="zh_name" />
            <el-table-column label="版本" prop="store.version" />
            <el-table-column label="发布时间">
              <template #default="scope">
                <span>{{ dayjs(scope.row.store.created).format('YYYY-MM-DD HH:mm') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="success" v-if="scope.row.upgrade" size="small" @click="upgrade(scope.row.id)">
                  升级
                </el-button>
                <el-button size="small" type="primary" v-if="!scope.row.installed" @click="install(scope.row.store.id)">
                  {{ data.installState }}
                </el-button>
                <el-button size="small" type="warning" @click="uninstall(scope.row)" v-if="scope.row.installed">
                  卸载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-4 justify-end flex">
            <el-pagination background layout="prev, pager, next" :total="data.total" v-model:current-page="data.page"
              :page-size="data.pageSize" />
          </div>
        </div>
        <Mine v-model:visible="data.openMine" />
      </el-tab-pane>
      <el-tab-pane label="大屏" name="screen">
        <div class="p-4 h-[calc(100%_-_48px)] overflow-y-auto">
          <el-table :data="data.screenList" >

          </el-table>
          <div class="mt-4 justify-end flex">
            <el-pagination background layout="prev, pager, next" :total="data.total" v-model:current-page="data.page"
              :page-size="data.pageSize" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  
  
</template>
<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { ArrowLeftBold, HelpFilled } from '@element-plus/icons-vue'
import { MarketApi } from '@/api/market'
import PluginAPI from '@/api/plugin'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import Mine from '@/market/Mine.vue'

const oss = import.meta.env.VITE_OSS


const data = reactive({
  activeName: 'plugin',
  localPluginList: [] as any[],
  installed: false,
  keyword: '',
  page: 1,
  pageSize: 10,
  list: [] as any[],
  total: 0,
  historyMap: new Map<string, { page: number, pageSize: number, list: any[], total: number }>(),
  openMine: false,
  waitingUpdateTotal: 0,
  manager: false,
  installState: "安装",
  screenList: []
})
onMounted(() => {
  console.log('market.onMounted')
  // 检查登录状态
  getPlugins();
  getUpdateTotal();
})

const getPlugins = async () => {
  return new Promise((resolve, reject) => {
    MarketApi.getPlugins({
      page: data.page,
      pageSize: data.pageSize,
      installed: data.installed,
      keyword: data.keyword,
      type: data.activeName
    }).then(async (res) => {
      const {data: localPluginsRes } = await PluginAPI.getPluginList({current_page: 1, per_page: 100});
      data.localPluginList = localPluginsRes.data.list || [];
      // 在本地插件列表中检索，判断是否已安装
      res.data.list.forEach((item: any) => {
        item.installed = data.localPluginList.find((localItem: any) => localItem.id === item.id)
      })
      data.list = res.data.list
      data.total = res.data.total
      resolve(res.data)
    })
  })

}
const expand = (row: any) => {
  let history = data.historyMap.get(row.id) || { page: 1, pageSize: 10, total: 0, list: [] }
  history.page = 1
  MarketApi.getHistory({ pluginId: row.id, page: history.page, pageSize: history.pageSize, state: 'passed' }).then(async (res) => {
    history.list = res.data.list
    history.total = res.data.total
    data.historyMap.set(row.id, history)
  })
}
const keydown = (e: KeyboardEvent) => {
  e.stopPropagation()
  e.preventDefault()
  data.page = 1
  getPlugins()
}

const pageChange = (pluginId: string, page: number) => {
  const record = data.historyMap.get(pluginId)
  if (record) {
    record.page = page
    MarketApi.getHistory({
      pluginId: pluginId,
      pageSize: record.pageSize,
      page: page
    }).then(res => {
      data.historyMap.get(pluginId)!.list = res.data.list
      data.historyMap.get(pluginId)!.total = res.data.total
    })
  }
}


const upgrade = (pluginId: string) => {
  ElMessageBox.confirm('升级插件可能会造成与现有功能不兼容的情况，点击确认升级', '提示').then(() => {
    MarketApi.upgrade(pluginId).then(() => {
      ElMessage.success('升级成功，刷新页面后生效')
      getPlugins()
      getUpdateTotal()
    })
  })
}
const install = (id: string) => {
  ElMessageBox.confirm(
    '点击确认安装该插件',
    '提示'
  ).then(() => {
    data.installState = "安装中"
    MarketApi.install(id).then(async res => {
      console.log('install', res.data.pluginId)
      const pluginId = res.data.pluginId;

      // 将插件安装到本地服务器
      try {
        let result = await MarketApi.getInstalledPlugins();
        // 查找当前插件
        const plugin = result.data.plugins.find((item: any) => item.pluginId === pluginId);
        if (!plugin.url) throw new Error("找不到插件")
        // 获取插件内容
        let file = await MarketApi.getRemoteFile(oss + plugin.url);
        if (!file.data) throw new Error("无法获取插件内容")

        data.installState = "上传到本地服务器..."
        // 保存插件到TP
        const fd = new FormData();
        fd.append('file', new File([new Blob([file.data])], "index.js"));
        fd.append('type', 'd_plugin')
        let upload = await PluginAPI.uploadPlugin(fd);
        if (upload.data.code !== 200) throw new Error("本地上传失败")

        // 保存到TP数据库
        let add = await PluginAPI.addPlugintoTP({ id: pluginId, plugin_url: upload.data.data})
        if (add.data.code !== 200) throw new Error("本地保存失败")
        ElMessage({
          message: '安装成功，刷新页面后生效',
          type: 'success'
        })
        getPlugins();
      }
      catch (error: any) {
        // 本地安装失败，卸载插件
        MarketApi.uninstall(id).then(res => {
          ElMessage({
            message: '安装失败，' + error.message,
            type: 'error'
          })
        })
        .finally(() => {
          data.installState = "安装"
        })
      }
    })
  })
}

const uninstall = (row: any) => {
  console.log('uninstall', row)
  ElMessageBox.confirm(
    '点击确认卸载该插件',
    '提示'
  ).then(async () => {
    try {
      let res1 = await MarketApi.uninstall(row.store.id)
      if (!res1.data) throw new Error("卸载失败");
      let res2 = await PluginAPI.delPluginfromTP({ id: row.id });
      if (res2.data.code !== 200) throw new Error("卸载失败");
      ElMessage({
          message: '卸载成功，刷新页面后生效',
          type: 'success'
      })
      getPlugins()
      getUpdateTotal()
      data.installState = "安装"
    }
    catch (error) {
      console.log(error)
    }
  })
}

const getUpdateTotal = () => {
  MarketApi.waitingUpdate().then(res => {
    data.waitingUpdateTotal = res.data.total
  })
}
</script>
<style lang="scss" scope>
.market-drawer {
  .el-drawer__body {
    padding: 0;
  }
}
.market-tabs  {
  padding: 0 0 0 30px;
  .el-tabs__header {
    background-color: #ffffff;
  }
}
</style>
