import {Enemy} from "../Enemy";
import {IGameObjectProps} from "../GameObject";

class OneDEnemyWalker extends Enemy  {
    public collidable: boolean = true;
    protected filePath: string = "assets/characters_one_dimension.png";
    protected key: string = "OneDEnemyWalker";
    protected frameWidth: number = 128;
    protected frameHeight: number = 128;
    protected startingFrame: number = 0;
    private xAxis: boolean;
    private offset: number;
    private startingLoc: number;
    private going: boolean;
    private incrementSpeed: number = 5;

    constructor(props: IEnemyObjectProps) {
        super(props);
        this.update = this.update.bind(this);
        this.offset = props.offset;
        this.xAxis = props.xAxis;
        this.startingLoc = this.xAxis ? props.x : props.y;
        this.going = true;
    }

    public create(): void {
        super.create();
        this.sprite.body.immovable = false;
        this.setNotImmovable();

    }

    public update(): void {
        super.update();

        const actualPos: number = this.xAxis ? this.sprite.body.x : this.sprite.body.y;
        const destination: number = this.going ? this.startingLoc + this.offset : this.startingLoc;

        if (Math.abs(actualPos - destination) < this.incrementSpeed) {
            this.xAxis ? this.sprite.body.x = destination : this.sprite.body.y = destination;
            this.going = !this.going;
            return;
        }

        if (actualPos < destination) {
            this.xAxis ? this.sprite.body.x += this.incrementSpeed : this.sprite.body.y += this.incrementSpeed;
            return;
        }

        if (actualPos > destination) {
            this.xAxis ? this.sprite.body.x -= this.incrementSpeed : this.sprite.body.y -= this.incrementSpeed;
            return;
        }
    }
}

interface IEnemyObjectProps extends IGameObjectProps {
    xAxis: boolean;
    offset: number;
}

export {IEnemyObjectProps, OneDEnemyWalker};
