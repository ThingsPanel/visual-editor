import { register } from "@antv/x6-vue-shape";
import { getDropComponent } from "../components/canvas-editor/DropComponent";
import { getDisplayComponent } from "@/display/components/DisplayComponent";
import { getDisplayPicComponent } from "@/display/components/DisplayPicComponent";
import { getDropPicComponent } from "../components/canvas-editor/DropPicComponent";
import { Component } from "vue";

/**
 * @author cxs
 * @date 2023-05-20
 * @update 2023-05-20
 * @description 插件配置接口
 * @interface IPluginConfig
 * @export
 */
class PluginConfig implements IPluginConfig  {
    private static instance: PluginConfig;
    plugins: any;
    components: Map<String, any>;
    screenRect: { width: number; height: number; };

    public constructor(plugins: any, screenRect: { width: number; height: number; } = { width: 1920, height: 1080}) {
        this.plugins = plugins;
        this.components = new Map<String, any>();
        this.screenRect = screenRect;
    }

    public static getInstance(plugins: any = null): PluginConfig {
        console.log('plugin.PluginConfig.getInstance', plugins)
        if (!PluginConfig.instance) {
            PluginConfig.instance = new PluginConfig(plugins);
        }
        return PluginConfig.instance;
    }
    
    public addComponent(name: String, component: any): void {
        this.components.set(name, component);
    }

    public setComponents(components: Map<String, any>): void {
        this.components = components;
    }

    public getComponent(name: String): any {
        return this.components.get(name);
    }

    public getComponents(): Map<String, any> {
        return this.components;
    }
    
    public getScreenRect(): { width: number; height: number; } {
        return this.screenRect;
    }

    public setPlugins(plugins: any): void {
        this.plugins = plugins;
    }

    public registerComponents(mode: "editor" | "display", data: any): void {
        console.log('============registerComponents===================', this.plugins)
        const plugins: any = this.plugins;
        for (const key in plugins) {
            const plugin = plugins[key];
            const { views } = plugin.default;
            views.forEach((view: any) => {
                if (data) {
                    data.forEach((cell: any) => {
                        if (cell.shape === view.name) {
                            // vue组件
                            if (mode === 'editor') {
                                const cpt: any = getDropComponent(view.Main);
                                this.registerComponent(cell, cpt);
                            } else if (mode === 'display') {
                                const cpt: Component = getDisplayComponent(view.Main, cell.data || null, view.type);
                                this.registerComponent(cell, cpt);
                            }
                        } else if (cell.data && cell.data.pic) {
                            // 图片
                            if (mode === 'editor') {
                                const cpt: any = getDropPicComponent(cell.data.pic);
                                this.registerComponent(cell, cpt);
                            } else if (mode === 'display') {
                                const cpt: any = getDisplayPicComponent(cell.data);
                                this.registerComponent(cell, cpt);
                            }
                        }
                    })
                }

            })
        }
        console.log('============registerComponents===================')
    }

    public registerComponent(cell: any, component: any): void {
        register({
            shape: cell.shape,
            width: cell.size.width === '100%' ? this.screenRect.width : cell.size.width,
            height: cell.size.height === '100%' ? this.screenRect.height : cell.size.height,
            component
          });
    }
   
}

export { PluginConfig }