import {GameObject, IGameObjectProps} from "../../game_objects/GameObject";
import {TestObject} from "../../game_objects/TestObject";
import {Player} from "../../game_objects/players/Player";
import {OneDPlayer} from "../../game_objects/players/OneDPlayer";

abstract class Level extends Phaser.State {
    protected gameObjectArray: GameObject[];
    protected abstract tiledJSONKey: string;
    protected player: Player;

    public init(...args): void {
        super.init(args);
        this.gameObjectArray = [];
    }

    public create(game: Phaser.Game): void {
        super.create(game);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.gameObjectArray.forEach((gameObject: GameObject) => {
            gameObject.attachLevel(this);
            gameObject.create();
        });
        if (this.player) {
            this.followPlayer(game);
        }
    }

    public preload(game: Phaser.Game): void {
        super.preload(game);
        this.renderMap(game);
        this.gameObjectArray.forEach((gameObject: GameObject) => {
            gameObject.preload();
        });
    }

    public update(game: Phaser.Game): void {
        super.update(game);
        this.gameObjectArray.forEach((gameObject: GameObject) => {
            gameObject.update();
        });
    }

    public getGameObjectArray(): GameObject[] {
        return this.gameObjectArray;
    }

    public setPlayer(player: Player): void {
        this.player = player;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public followPlayer(game: Phaser.Game): void {
        game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    }

    protected renderMap(game: Phaser.Game): void {
        const json: any = game.cache.getJSON(this.tiledJSONKey, false);
        this.renderLayers(json, game);
    }

    private renderLayers(json: any, game: Phaser.Game): void {
        const ref: any = {};

        game.world.resize(json.width * json.tilewidth, json.height * json.tileheight);

        json.tilesets.forEach((tileset: any): void => {
            Object.keys(tileset.tileproperties).forEach((key: string): void => {
                const num: number = parseInt(key);
                const regKey: string = (num + tileset.firstgid).toString();
                ref[regKey] = tileset.tileproperties[key].gameObjectID;
            });
        });

        json.layers.forEach((layer: any) => {
            if (layer.type === "tilelayer") {
                layer.data.forEach((numRef: any, i: number) => {
                    const keyRef: string = numRef.toString();
                    // const y: number = Math.floor(i / (layer.width - 1)) * json.tileheight;
                    const y: number = Math.floor((i / layer.width)) * json.tileheight;
                    const x: number = (i % layer.width) * json.tilewidth;
                    this.renderGameObject(ref[keyRef], x, y, game);
                });
            } else {
                layer.objects.forEach((obj: any): void => {
                    this.renderGameObject(obj.properties.gameObjectID, obj.x, obj.y, game);
                });
            }
        });
    }

    private renderGameObject(keyRef: string, x: number, y: number, game: Phaser.Game): void {
        let gameObject: GameObject;

        const gameObjectProp: IGameObjectProps = {
            game,
            x,
            y,
        };

        switch (keyRef) {
            case "purple":
                gameObject = new TestObject(gameObjectProp);
                break;
            case "OneDPlayer":
                gameObject = new OneDPlayer(gameObjectProp);
                break;
        }

        if (gameObject) {
            this.gameObjectArray.push(gameObject);
        }
    }
}

export {Level};
