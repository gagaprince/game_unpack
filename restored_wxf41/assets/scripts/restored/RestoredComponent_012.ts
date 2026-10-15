import { _decorator, Component, Asset, Node } from 'cc';
const { ccclass, property } = _decorator

@ccclass('9d992VDm1FECo27GTxJW4Cj')
export class RestoredComponent_012 extends Component {
    @property({ type: Node })
    public delegate: Node = null;

    @property({ type: Node })
    public delegateUpdate: Node = null;

    @property({ type: Node })
    public initFinish: Node = null;

    @property({ type: Asset })
    public prefab: Asset = null;

    @property
    public spaceY: number = 0;

}
