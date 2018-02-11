import {Walker} from "../Walker";

class OneDEnemyWalker extends Walker  {
    protected filePath: string = "assets/characters_one_dimension.png";
    protected key: string = "OneDEnemyWalker";
    protected frameWidth: number = 128;
    protected frameHeight: number = 128;
    protected startingFrame: number = 0;
}

export {OneDEnemyWalker};
