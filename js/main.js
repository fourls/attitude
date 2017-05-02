function setBackgroundColor(color) {
    game.stage.backgroundColor = color;
    document.body.style.backgroundColor = color;
}

function goToLevel(lev) {
    if (lev -1 < levels.length) {
        currentLevel = lev - 1;
        game.state.start('main');
        console.log("Level " + lev.toString() + " now playing.");
    } else {
        console.log("Level " + lev.toString() + " does not exist.");
    }
}

function createMapFromArray (arr) {
    var returnArr = [];
    for(var y = 0; y < arr.length; y++) {
        returnArr[y] = '';
        for (var x = 0; x < arr[y].length; x++) {
            returnArr[y] += arr[y][x];
        }
    }
    
    return returnArr;
}

var userLevel = {
    map: [],
    array: []
};
var levels = [
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x@     !           x',
        'x                  x',
        'x      o           x',
        'x                  x',
        'x      !    o      x',
        'xxxxxxxx           x',
        'x                  x',
        'xo                 x',
        'xx                 x',
        'x                  x',
        'x      x      o    x',
        'x                  x',
        'xx                 x',
        'x     o            x',
        'x    xxxx          x',
        'x    x  x          x',
        'x  xxx             x',
        'x              o   x',
        'xxxxxxxxx!!!!!!x!!!x',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x                  x',
        'x        o         x',
        'x                  x',
        'x                  x',
        'x       xxxx       x',
        'x    o        o    x',
        'x    x        x    x',
        'xxx      @       xxx',
        'x       xxxx       x',
        'x                  x',
        'x   !!!! o  !!!!   x',
        'x        x         x',
        'x                  x',
        'x        xx        x',
        'x     x      x     x',
        'xxx              xxx',
        'x                  x',
        'x         o        x',
        'xxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x         x        x',
        'x   x         o    x',
        'x      xxxxxxxxxxxxx',
        'xx                 x',
        'x     o            x',
        'x                  x',
        'xxx!!!!       o    x',
        'x        xxxxxxxx!!x',
        'x                  x',
        'x                  x',
        'x  xxxxxx o        x',
        'x       x!!!x      x',
        'x   o   x   x      x',
        'x           xxx    x',
        'xxxxxxxxx   x      x',
        'x                xxx',
        'x                  x',
        'x @                x',
        'xxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x                  x',
        'x    xxxxxxxxx     x',
        'x o  x         o   x',
        'xxxxxx             x',
        'x                xxx',
        'x          o       x',
        'x    xxxxxxxxxxxxxxx',
        'x        @         x',
        'xx                 x',
        'x                  x',
        'x            o     x',
        'xxxxxxx            x',
        'x                  x',
        'x!!!!!!!!!!!  !!!!!x',
        'x                  x',
        'x    o             x',
        'x                  x',
        'x           o      x',
        'xxxxxxxxxxxxxxxxxxxx',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x   @x             x',
        'x xxxx   o         x',
        'x       xxx        x',
        'x                  x',
        'x!xxxx           o x',
        'x              xxxxx',
        'x    o             x',
        'x  xxxxxx          x',
        'x                  x',
        'x                  x',
        'x                  x',
        'xx                 x',
        'x                  x',
        'x   o              x',
        'x   x              x',
        'x       xxxxx      x',
        'x                  x',
        'xo               o x',
        'x!!!!!!!!!!!!!!!xx!x',
    ],
    [
        '!!!!!!!!!!!!!!!!!!!!',
        '!   @              !',
        '!                  !',
        '!                  !',
        '!                  !',
        '!    o             !',
        '!    x     o       !',
        '!                  !',
        '!                  !',
        '!             o    !',
        '!             x    !',
        '!                  !',
        '!       x          !',
        '!o                 !',
        '!x                 !',
        '!    o             !',
        '!                  !',
        '!                  !',
        '!       o          !',
        '!!!!!!!!!!!!!!!!!!!!',
    ],
    [
        'xxxxxxxxxxxxxxxxxxxx',
        'x@ xo      xo     ox',
        'xx xx      x       x',
        'x   x              x',
        'x x x  xxxxxxxxxxxxx',
        'x x                x',
        'x xxxxxxxx  xxxxxxxx',
        'x   ox             x',
        'xxx  x             x',
        'x                  x',
        'x                  x',
        'xx                 x',
        'xxxxx     o        x',
        'x        xxxx      x',
        'x     o            x',
        'x                  x',
        'x      o           x',
        'x                  x',
        'x o              o x',
        'xxxxxxxxxxxxxxxxxxxx',
    ],
    [
        '           xxxxxxxxx',
        '           x      @x',
        '           x o     x',
        '           x       x',
        'xxxxxxxxxxxx  xxxxxx',
        'x             x     ',
        'x      o      x     ',
        'x             x     ',
        'x  xxxxxxxxxxxxxxxxx',
        'x  xo   x          x',
        'x  x               x',
        'x                  x',
        'x      xx    o     x',
        'xxx  xxxx          x',
        '  x  x             x',
        '  x                x',
        '  x        o       x',
        '  x  x             x',
        '  xo x  o      o   x',
        '  x!!xxxxxxxxxxxxxxx',
    ],  
];

var currentLevel = 0;
var levelCreatorListenersInitialised = false;
var deaths = 0;
var inUserLevel = false;

var beginningState = {
    preload: function() {
        setBackgroundColor("#3598db");
        game.load.image('loading', 'assets/loading.png');
    },
    create: function() {
        game.state.add("loading", loadingState);
        game.state.start("loading");
    }
};
var loadingState = {
    preload: function() {
        //var loadingBar = game.add.sprite(game.world.centerX - (100/2), game.world.centerX - (20/2), "loading");
        //this.load.setPreloadSprite(loadingBar);
        setBackgroundColor("#3598db");
        
        game.load.image('player','assets/player.png');
        game.load.image('wall','assets/wall.png');
        game.load.image('coin','assets/coin.png');
        game.load.image('enemy','assets/enemy.png');
        game.load.image('select','assets/select.png');
        game.load.image('outline','assets/outline.png');
    },
    create: function() {
        game.state.add('main', mainState);
        game.state.add('menu',gameMenuState);
        game.state.add('death',deathState);
        game.state.add('levelComplete',levelCompleteState);
        game.state.add('end',endState);
        game.state.add("levelCreator", levelCreatorState);
        
        game.state.start("menu");
    }
};
var gameMenuState = {
    preload: function () {
    },
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "what attitude?", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor("#3598db");
        game.add.existing(this.titleText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.b = game.input.keyboard.addKey(Phaser.Keyboard.B);
    },
    update: function() {
        if(this.spacebar.isDown) {
            game.state.start("main");
        } else if (this.b.isDown) {
            game.state.start("levelCreator");
        }
    }
};
var deathState = {
    preload: function () {
    },
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "bad attitude.", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor("#3598db");
        game.add.existing(this.titleText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        if(inUserLevel) {
            
        } else {
            deaths ++;
            if(deaths > 3) {
                this.titleText.text = "worst attitude.";
                setBackgroundColor("#953f3f");
                deaths = 0;
                currentLevel = 0;
            }
        }
    },
    update: function() {
        if(this.spacebar.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("main");
            }
        }
    }
};
var endState = {
    preload: function () {
    },
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "best attitude.", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor("#67b56d");
        game.add.existing(this.titleText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceCd = 0;
    },
    update: function() {
    }
};
var levelCompleteState = {
    preload: function () {
    },
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "good attitude.", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor("#3598db");
        game.add.existing(this.titleText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        if(!inUserLevel) {
            currentLevel ++;
            if (currentLevel >= levels.length) {
                game.state.start('end');
            }
        } else {
            game.state.start("levelCreator");
        }
    },
    update: function() {
        if(this.spacebar.isDown) {
            if(inUserLevel) {
            } else {
                game.state.start("main");
            }
        }
    }
};
var levelCreatorState = {
    preload: function () {
    },
    init: function() {
    },
    removeEventListeners: function() {
        this.wallKey.onDown.removeAll();
        this.coinKey.onDown.removeAll();
        this.enemyKey.onDown.removeAll();
        this.playerKey.onDown.removeAll();
        this.deleteKey.onDown.removeAll();
        this.debugKey.onDown.removeAll();
        this.submitKey.onDown.removeAll();
        this.cursorKeys.left.onDown.removeAll();
        this.cursorKeys.right.onDown.removeAll();
        this.cursorKeys.up.onDown.removeAll();
        this.cursorKeys.down.onDown.removeAll();
    },
    create: function() {
        game.world.enableBody = false;
        setBackgroundColor("#3598db");
        this.cursor = [0,0];
        
        this.map = 
        [//   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
        ];
        
        
        game.add.sprite(0,0,'outline');
        
        this.wallKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.coinKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.enemyKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.playerKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.deleteKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
        this.submitKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.cursorKeys = game.input.keyboard.createCursorKeys();
        
        if(!levelCreatorListenersInitialised) {
            this.wallKey.onDown.add(() => {
                this.map[this.cursor[1]][this.cursor[0]] = "x";
                this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'wall'));
            });
            this.coinKey.onDown.add(() => {
                this.map[this.cursor[1]][this.cursor[0]] = "o";
                this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'coin'));
            });
            this.enemyKey.onDown.add(() => {
                this.map[this.cursor[1]][this.cursor[0]] = "!";
                this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'enemy'));
            });
            this.playerKey.onDown.add(() => {
                this.map[this.cursor[1]][this.cursor[0]] = "@";
                this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'player'));
            });
            this.deleteKey.onDown.add(() => {
                this.map[this.cursor[1]][this.cursor[0]] = " ";
                for (var i = 0; i < this.buildingBlocks.children.length; i++) {
                    if(
                        (this.buildingBlocks.children[i].x/20) - 1 == this.cursor[0] &&
                        (this.buildingBlocks.children[i].y/20) - 1 == this.cursor[1]
                    ) {
                        this.buildingBlocks.children[i].kill();
                    }
                }
            });
            this.submitKey.onDown.add(() => {
                userLevel["array"] = this.map;
                userLevel["map"] = createMapFromArray(this.map);
                inUserLevel = true;
                this.removeEventListeners();
                game.state.start("main");
            });
            this.debugKey.onDown.add(() => {
                console.log(createMapFromArray(this.map));
            });

            this.cursorKeys.left.onDown.add(() => {
                if (this.cursor[0] > 0) {
                    this.cursor[0] --;
                    this.cursorSprite.x = this.cursor[0]*20 + 20;
                }
            });
            this.cursorKeys.right.onDown.add(() => {
                if (this.cursor[0] < 19) {
                    this.cursor[0] ++;
                    this.cursorSprite.x = this.cursor[0]*20 + 20;
                }
            });
            this.cursorKeys.up.onDown.add(() => {
                if (this.cursor[1] > 0) {
                    this.cursor[1] --;
                    this.cursorSprite.y = this.cursor[1]*20 + 20;
                }
            });
            this.cursorKeys.down.onDown.add(() => {
                if (this.cursor[1] < 19) {
                    this.cursor[1] ++;
                    this.cursorSprite.y = this.cursor[1]*20 + 20;
                }
            });
        }
        
        
        this.buildingBlocks = game.add.group();
        
        if (inUserLevel) {
            this.map = userLevel["array"];
            inUserLevel = false;
            
            for (var i = 0; i < this.map.length; i++) {
                for (var j = 0; j < this.map[i].length; j++) {
                    if (this.map[i][j] == 'x') {
                        var wall = game.add.sprite(20+20*j,20+20*i,'wall');
                        this.buildingBlocks.add(wall);
                    } else if (this.map[i][j] == 'o') {
                        var coin = game.add.sprite(20+20*j,20+20*i,'coin');
                        this.buildingBlocks.add(coin);
                    } else if (this.map[i][j] == '!') {
                        var enemy = game.add.sprite(20+20*j,20+20*i,'enemy');
                        this.buildingBlocks.add(enemy);
                    } else if (this.map[i][j] == '@') {
                        var player = game.add.sprite(20+20*j,20+20*i,'player');
                        this.buildingBlocks.add(player);
                    }
                }
            }
        }
        
        
        this.cursorSprite = game.add.sprite(20,20,'select');
        this.selectGroup = game.add.group();
        this.selectGroup.add(this.cursorSprite);
    },
    update: function() {
        if (this.keyQ.isDown) {
            inUserLevel = false;
            this.removeEventListeners();
            game.state.start("menu");
        }
    }
};
var mainState = {
    preload: function() {
    },
    create: function() {
        setBackgroundColor("#3598db");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
        
        this.cursor = game.input.keyboard.createCursorKeys();
        this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.iWantToDie = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.walls = game.add.group(); // x
        this.coins = game.add.group(); // o
        this.enemies = game.add.group(); // !
        
        // 20x20 level 
        
        var level = levels[currentLevel];
        if (inUserLevel) {
            level = userLevel["map"];
        }
        var playerX = 60;
        var playerY = 100;
        
        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {
                if (level[i][j] == 'x') {
                    var wall = game.add.sprite(20+20*j,20+20*i,'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                } else if (level[i][j] == 'o') {
                    var coin = game.add.sprite(20+20*j,20+20*i,'coin');
                    this.coins.add(coin);
                } else if (level[i][j] == '!') {
                    var enemy = game.add.sprite(20+20*j,20+20*i,'enemy');
                    this.enemies.add(enemy);
                } else if (level[i][j] == '@') {
                    playerX = 20+20*j;
                    playerY = 20+20*i;
                }
            }
        }
        
        this.player = game.add.sprite(playerX,playerY,'player');
        this.player.body.gravity.y = 1200;
    },
    update: function() {
        game.physics.arcade.collide(this.player,this.walls);
        game.physics.arcade.collide(this.player,this.coins, this.takeCoin, null, this);
        game.physics.arcade.collide(this.player,this.enemies, this.death, null, this);
        
        
        if (this.cursor.left.isDown || this.keyA.isDown)
            this.player.body.velocity.x = -200;
        else if (this.cursor.right.isDown || this.keyD.isDown)
            this.player.body.velocity.x = 200;
        else
            this.player.body.velocity.x = 0;
        
        if ((this.cursor.up.isDown || this.keySpace.isDown || this.keyW.isDown) && this.player.body.touching.down)
            this.player.body.velocity.y = -380;
        
        if(this.coins.total == 0) {
            this.passLevel();
        }
        
        if(this.iWantToDie.isDown) {
            this.death();
        }
    
        if(this.keyQ.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
            }
        }
    },
    takeCoin: function(player,coin) {
        coin.kill();
        this.player.body.touching.down = false;
    },
    death: function() {
        game.state.start('death');
    },
    passLevel: function() {
        game.state.start('levelComplete');
    }
};

var game = new Phaser.Game(440, 440,Phaser.AUTO,"container");
game.state.add("beginning",beginningState);
game.state.start('beginning');
