import { _decorator, Component, Asset, Color, Node, Size, Vec3 } from 'cc';
const { ccclass, property } = _decorator

@ccclass('CCPropertyOverrideInfo')
export class RestoredComponent_013 extends Component {
    @property
    public propertyPath: any[] = [];

    @property({ type: Node })
    public targetInfo: Node = null;

    @property
    public value: any = null;

}
