/*
 * @Author: chaoxiaoshu-mx leukotrichia@163.com
 * @Date: 2023-06-20 08:54:52
 * @LastEditors: chaoxiaoshu-mx leukotrichia@163.com
 * @LastEditTime: 2023-11-15 15:27:54
 * @FilePath: \tp-editor\src\editor\components\canvas-editor\DropPicComponent.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Component, defineComponent } from "vue";
import { Node } from "@antv/x6";
import { isJSON } from "@/utils"
export const getDropPicComponent = (url: String): Component => {
    return defineComponent({
        inject: ["getNode"],
        data() {
            return {
                value: undefined,
                style: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: undefined,
                    fit: 'contain'
                },
                option: {},
                data: {}
            }
        },
        mounted() {
            const node: Node = (this as any).getNode() as Node;
            // node.setData({
            //     pic: url
            // })

            this.setData(node.getData());
            // 监听节点的附加数据变化
            node.on("change:data", ({ current }) => this.setData(current));
        },
        methods: {
            setData(data: any) {
                if (!data) return;
                // 判断是否为json字符串
                const jsonObj = isJSON(data.jsonData);
                if (jsonObj?.style) {
                    this.style = { ...jsonObj.style, width: '100%', height: '100%' }
                }
            }
        },
        render() {
            return (
                <div style={this.style}>
                    <el-image style="width: 100%; height: 100%" src={url} fit={this.style.fit}/>
                </div>
            )
        }
    })
}