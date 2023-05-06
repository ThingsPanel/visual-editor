import { Cell } from '@antv/x6';
import { Ref } from 'vue';

interface ComponentProps extends Cell{
    id: string;
    type: string;
    icon: string;
    name: string;
    description: string;
    defProps: {
        top: number;
        left: number;
        width: number;
        height: number;
        zIndex: number;
    };
    props: Record<string, any>;
    component: VueComponent;
    events: Record<string, any>;
    slots: Record<string, any>;
    children: ComponentProps[];
    parent: Ref<ComponentProps | null>;
    isContainer: boolean;
    isRoot: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    isSelectable: boolean;
    isDroppable: boolean;
    isEditable: boolean;
    isDeletable: boolean;
    isExportable: boolean;
}