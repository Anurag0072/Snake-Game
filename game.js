import * as Config from './constants.js';
import Grid from './Grid.js';
import Snake from './Snake.js';
import { DIRECTIONS } from './utils.js';


export default class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.append(this.canvas);

        this.canvas.width = Config.WIDTH * Config.CELLSIZE;

        this.canvas.height = Config.HEIGHT * Config.CELLSIZE;

        this.canvas.style.width = Config.WIDTH * Config.CELLSIZE + 'px';
        this.canvas.style.height = Config.HEIGHT * Config.CELLSIZE + 'px';

        this.configuration = {
            level: 0,
            appleMultiple: Config.APPLES,
            speed: Config.SPEED,
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: Config.WIDTH,
            nbCellsY: Config.HEIGHT,
            cellSideLength: Config.CELLSIZE,
            color: Config.COLORS[0]
        };

        this.nextMove = 0;
        this.score = 0;

        //event handling
        window.addEventListener('keydown',this.onKeyDown);


        this.grid = new Grid(this);//pass o the ganme obj
        this.snake = new Snake(this);
    };

    start() {
        this.running = true;
        requestAnimationFrame(this.loop);
    }
    stop() {
        this.running = false;
    }
    loop = (time) => {
        if (this.running) {

            //console.log('loop');

            requestAnimationFrame(this.loop);
            //console.log(time);
            if (time > this.nextMove) {
                console.log('refresh th egame');
                this.nextMove = time + this.configuration.speed;

                //Move the Snake
                this.snake.move();

                switch (this.checkState()) {
                    case -1: //game over
                        this.gameOver();
                        break;
                    case 1://went over apple and wins points
                         this.snake.grow();
                         this.score += 100;
                         document.getElementById('score').textContent = `Score: ${this.score}`;
                         document.getElementById('level').innerHTML = `level: ${this.configuration.level}`;
                         this.grid.eat(this.snake.getHead());

                         //is level completed
                         if(this.isLevelCompleted()){
                              this.levelUp();
                         }
                    default:
                        this.paint();
                }
            }
        }
    }
    //returns -1 if game over
    //1 if apple is cosumed
    checkState() {
        const head = this.snake.getHead();

        if (this.grid.isOutside(head) || this.snake.isTail(head)) {
            return -1;
        }
        if (this.grid.isApple(head)) {
            return 1;
        }

        return 0;
    }
    gameOver() {
        alert('Game Over');
        this.stop();
    }

    paint(){
        
        const {
            color,
            width,
            height
        } = this.configuration;
        const ctx = this.canvas.getContext( '2d' );
        //base rect for the game
        ctx.fillStyle = color;
        ctx.fillRect( 0,0,width, height );

        this.grid.draw(ctx);
        this.snake.draw(ctx);
    }

    onKeyDown=(event)=>{
        switch (event.key){
            case 'ArrowUp':
                this.snake.setDirection( DIRECTIONS.UP);
                break;
            case 'ArrowDown':
                this.snake.setDirection( DIRECTIONS.DOWN);
                break;
            case 'ArrowRight':
                this.snake.setDirection( DIRECTIONS.RIGHT);
                break;
            case 'ArrowLeft':
                this.snake.setDirection( DIRECTIONS.LEFT);
                break;

        }
    }
    isLevelCompleted(){
        return this.grid.noMoreApples();
    }
   
    levelUp(){
        this.score += 1000;
        this.configuration.level+1;
        this.configuration.level++;

        //if level 9 was compleed
        if(this.configuration.level >= Config.MAX_LEVEL){
            this.gameWon();
            this.stop();
            return;
        }
        this.configuration.speed -= 7;
        this.configuration.color = Config.COLORS[this.configuration.level];
        this.grid.seed();
    }
    gameWon(){
        alert('You Won');
    }
}

