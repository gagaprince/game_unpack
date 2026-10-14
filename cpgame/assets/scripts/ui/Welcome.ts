import { _decorator, Component, Node, Button, Label, UIOpacity, tween, Vec3, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('Welcome')
export class Welcome extends Component {
    private startButton!: Node;
    private settingButton!: Node;
    private logo!: Node;
    private tipLabel!: Label;
    private tipOpacity!: UIOpacity;

    start() {
        this.startButton = this.node.getChildByPath('BtnStart')!;
        this.settingButton = this.node.getChildByPath('BtnSetting')!;
        this.logo = this.node.getChildByPath('Logo')!;
        const tipNode = this.node.getChildByPath('TipLabel');
        this.tipLabel = tipNode!.getComponent(Label)!;
        this.tipOpacity = tipNode!.getComponent(UIOpacity) || tipNode!.addComponent(UIOpacity);
        this.tipOpacity.opacity = 0;

        this.startButton.on(Button.EventType.CLICK, this.onStartClick, this);
        this.settingButton.on(Button.EventType.CLICK, this.onSettingClick, this);

        this.playLogoIdle();
    }

    private playLogoIdle() {
        tween(this.logo)
            .repeatForever(
                tween()
                    .to(1.2, { scale: new Vec3(1.04, 1.04, 1) }, { easing: 'sineInOut' })
                    .to(1.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineInOut' })
            )
            .start();
    }

    private onStartClick() {
        console.log('[Welcome] start button clicked');
        director.loadScene('game');
        tween(this.startButton)
            .to(0.08, { scale: new Vec3(0.92, 0.92, 1) })
            .to(0.12, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }

    private onSettingClick() {
        console.log('[Welcome] setting button clicked');
        this.tipLabel.string = '设置面板开发中';
        tween(this.tipOpacity)
            .set({ opacity: 255 })
            .delay(1.2)
            .to(0.5, { opacity: 0 })
            .start();
    }
}
