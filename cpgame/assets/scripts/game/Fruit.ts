import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Fruit')
export class Fruit extends Component {
    public level = 1;
    public dropped = false;
}
