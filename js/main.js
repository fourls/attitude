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
    
];
var currentLevel = 0;
var deaths = 0;

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
    },
    create: function() {
        game.state.add('main', mainState);
        game.state.add('menu',gameMenuState);
        game.state.add('death',deathState);
        game.state.add('levelComplete',levelCompleteState);
        game.state.add('end',endState);
        
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
    },
    update: function() {
        if(this.spacebar.isDown) {
            game.state.start("main");
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
        deaths ++;
        setBackgroundColor("#3598db");
        game.add.existing(this.titleText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        if(deaths > 3) {
            this.titleText.text = "worst attitude.";
            setBackgroundColor("#953f3f");
        }
    },
    update: function() {
        if(this.spacebar.isDown && deaths <= 3) {
            game.state.start("main");
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
        currentLevel ++;
        if (currentLevel >= levels.length) {
            game.state.start('end');
        }
    },
    update: function() {
        if(this.spacebar.isDown) {
            game.state.start("main");
        }
    }
};
var mainState = {
    preload: function() {
    },
    createLevel: function() {
        var level = levels[currentLevel];
        
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
    create: function() {
        setBackgroundColor("#3598db");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
        
        this.cursor = game.input.keyboard.createCursorKeys();
        this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.iWantToDie = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.walls = game.add.group(); // x
        this.coins = game.add.group(); // o
        this.enemies = game.add.group(); // !
        
        // 20x20 level 
        this.createLevel();
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
