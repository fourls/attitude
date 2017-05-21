/*

MAPS are [x    x  o  xxxx]
ARRAYS are [x, , , ,x, ,o, x,x,x,x]

*/

var tutorialShowing = false;

function showTutorial() {
    $(".tutorial").fadeTo(300,1);
    tutorialShowing = true;
    setTimeout(function(){
        tutorialShowing = false;
        $(".tutorial").fadeTo(300,0);
        setDialog('menu');
    },2000);
}

function setDialog(currentLoc) {
    $("#context-dialog .contents").css("display","none");
    if(!tutorialShowing) {
        switch (currentLoc) {
            case 'main':
                $("#context-dialog .contents#main").css("display","block");
                break;
            case 'levelCreator':
                $("#context-dialog .contents#levelcreator").css("display","block");
                break;
            case 'menu':
                $("#context-dialog .contents#menu").css("display","block");
                break;
            case 'between':
                $("#context-dialog .contents#between").css("display","block");
                break;
        }
    }
}

function setBackgroundColor(color) {
    game.stage.backgroundColor = color;
    document.body.style.backgroundColor = color;
}

/*
function goToLevel(lev) {
    if (lev -1 < levels.length) {
        currentLevel = lev - 1;
        game.state.start('main');
        console.log("Level " + lev.toString() + " now playing.");
    } else {
        console.log("Level " + lev.toString() + " does not exist.");
    }
}
*/

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

/*

    20x20 array
    
    11111111111111111111
    10000000000000100001
    10000000000000100401
    10000000000000000001
    10200000000000000001
    11111100000000111111
    10000000000000000001
    10000000002000000001
    10000000011100000001
    10000000000000000001
    10200000000000000201
    11111100000000111111
    10000000000000000001
    10000000002000000001
    10000000011100000001
    10000000000000000001
    10000000000000000001
    10000000000000000001
    10200000000000000201
    11111133311333111111 
1111111111111111111110000000000000100001100000000000001004011000000000000000000110200000000000000001111111000000001111111000000000000000000110000000002000000001100000000111000000011000000000000000000110200000000000000201111111000000001111111000000000000000000110000000002000000001100000000111000000011000000000000000000110000000000000000001100000000000000000011020000000000000020111111133311333111111
*/

function createCodeFromArray(arr) {
    var code = '';
    for(var y = 0; y < arr.length; y++) {
        for(var x = 0; x < arr[y].length; x++) {
            var item = '0';
            switch (arr[y][x]) {
                case 'x':
                    item = '1';
                    break;
                case 'o':
                    item = '2';
                    break;
                case '!':
                    item = '3';
                    break;
                case '@':
                    item = '4';
                    break;
                case 's':
                    item = '5';
                    break;
                case 'd':
                    item = '6';
                    break;
            }
            code += item;
        }
    }
    return code;
}

function createArrayFromCode(code) {

    codeArr = (code).split("").map(Number);
    if(codeArr.length != 400) {
        return codeArr;
    }
    returnArr = [];
    for(var i = 0; i < codeArr.length; i++) {
        y = Math.floor(i / 20);
        x = i - (y * 20);

        if(x == 0) {
            returnArr[y] = [];
        }

        var item = ' ';
        switch (codeArr[i]) {
            case 1:
                item = 'x';
                break;
            case 2:
                item = 'o';
                break;
            case 3:
                item = '!';
                break;
            case 4:
                item = '@';
                break;
            case 5:
                item = 's';
                break;
            case 6:
                item = 'd';
                break;
        }

        returnArr[y][x] = item;
    }

    return returnArr;
}

var userLevel = {
    map: [],
    array: []
};
var keyCD = {};

var currentLevel = 0
var deaths = 0;
var inUserLevel = false;

var beginningState = {
    preload: function() {
        setBackgroundColor("#3598db");
        game.load.image('loading', 'assets/loading.png');
        game.load.image('loading-bg', 'assets/loading-bg.png');
    },
    create: function() {
        game.state.add("loading", loadingState);
        game.state.start("loading");
    }
};
var loadingState = {
    preload: function() {
        game.add.sprite(game.world.centerX - (440/2), game.world.centerY - (20/2), "loading-bg");
        var loadingBar = game.add.sprite(game.world.centerX - (440/2), game.world.centerY - (20/2), "loading");
        this.load.setPreloadSprite(loadingBar);
        setBackgroundColor("#3598db");
        
        game.load.image('player','assets/player.png');
        game.load.image('wall','assets/wall.png');
        game.load.image('coin','assets/coin.png');
        game.load.image('enemy','assets/enemy.png');
        game.load.image('select','assets/select.png');
        game.load.image('outline','assets/outline.png');
        game.load.spritesheet('door','assets/door.png', 20, 20);
        game.load.spritesheet('switch','assets/switch.png', 20, 20);
    },
    create: function() {
        game.state.add('main', mainState);
        game.state.add('menu',gameMenuState);
        game.state.add('death',deathState);
        game.state.add('levelComplete',levelCompleteState);
        game.state.add('end',endState);
        game.state.add("levelCreator", levelCreatorState);
        
        game.state.start("menu");
        showTutorial();
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
        this.levCreText = game.make.text(game.world.centerX, game.world.centerY + 70, "[space] play\n\n[b] level maker", {
            font: 'bold 18px monospace',
            fill: 'rgba(255,255,255,0.6)',
            align: 'left'
        });
        this.levCreText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor("#3598db");
        game.add.existing(this.titleText);
        //game.add.existing(this.levCreText);
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.b = game.input.keyboard.addKey(Phaser.Keyboard.B);
        setDialog('menu');
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
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
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
        setDialog('between');
    },
    update: function() {
        if(this.spacebar.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("main");
            }
        }
        if(this.keyQ.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
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
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.spaceCd = 0;
        currentLevel = 0;
    },
    update: function() {
        if(this.keyQ.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
            }
        }
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
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        if(!inUserLevel) {
            currentLevel ++;
            deaths = 0;
            if (currentLevel >= levels.length) {
                game.state.start('end');
            }
        } else {
        }

        setDialog('between');
    },
    update: function() {
        if(this.spacebar.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("main");
            }
        }
        
        if(this.keyQ.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
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
        this.switchKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.doorKey = game.input.keyboard.addKey(Phaser.Keyboard.X);

        this.deleteKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

        this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.openKey = game.input.keyboard.addKey(Phaser.Keyboard.T);

        this.submitKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);

        this.cursorKeys = game.input.keyboard.createCursorKeys();
        
        /*
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
        }*/
        
        
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
                    } else if (this.map[i][j] == 's') {
                        var _switch = game.add.sprite(20+20*j,20+20*i,'switch');
                        _switch.frame = 0;
                        this.buildingBlocks.add(_switch);
                    } else if (this.map[i][j] == 'd') {
                        var door = game.add.sprite(20+20*j,20+20*i,'door');
                        door.frame = 0;
                        this.buildingBlocks.add(door);
                    }
                }
            }
        }
        
        
        this.cursorSprite = game.add.sprite(20,20,'select');
        this.selectGroup = game.add.group();
        this.selectGroup.add(this.cursorSprite);


        setDialog('levelCreator');
    },
    update: function() {
        if(this.wallKey.isDown && (keyCD["wallKey"] < game.time.now || keyCD["wallKey"] == undefined)) {
            keyCD["wallKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "x";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'wall'));
        }
        if(this.coinKey.isDown && (keyCD["coinKey"] < game.time.now || keyCD["coinKey"] == undefined)) {
            keyCD["coinKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "o";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'coin'));
        }
        if(this.enemyKey.isDown && (keyCD["enemyKey"] < game.time.now || keyCD["enemyKey"] == undefined)) {
            keyCD["enemyKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "!";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'enemy'));
        }
        if(this.playerKey.isDown && (keyCD["playerKey"] < game.time.now || keyCD["playerKey"] == undefined)) {
            keyCD["playerKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "@";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'player'));
        }
        if(this.switchKey.isDown && (keyCD["switchKey"] < game.time.now || keyCD["switchKey"] == undefined)) {
            keyCD["switchKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "s";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'switch'));
        }
        if(this.doorKey.isDown && (keyCD["doorKey"] < game.time.now || keyCD["doorKey"] == undefined)) {
            keyCD["doorKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = "d";
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'door'));
        }
        if(this.deleteKey.isDown && (keyCD["deleteKey"] < game.time.now || keyCD["deleteKey"] == undefined)) {
            keyCD["deleteKey"] = game.time.now + 150;
            this.map[this.cursor[1]][this.cursor[0]] = " ";
            for (var i = 0; i < this.buildingBlocks.children.length; i++) {
                if(
                    (this.buildingBlocks.children[i].x/20) - 1 == this.cursor[0] &&
                    (this.buildingBlocks.children[i].y/20) - 1 == this.cursor[1]
                ) {
                    this.buildingBlocks.children[i].kill();
                }
            }
        }
        if(this.submitKey.isDown) {
            userLevel["array"] = this.map;
            userLevel["map"] = createMapFromArray(this.map);
            inUserLevel = true;
            this.removeEventListeners();
            game.state.start("main");
        }
        if(this.debugKey.isDown && (keyCD["debugKey"] < game.time.now || keyCD["debugKey"] == undefined)) {
            keyCD["debugKey"] = game.time.now + 200;
            prompt("Here is your game number.", createCodeFromArray(this.map));
        }
        if(this.openKey.isDown && (keyCD["openKey"] < game.time.now || keyCD["openKey"] == undefined)) {
            keyCD["openKey"] = game.time.now + 200;
            levelNo = prompt("Enter your game number.");
            if(levelNo != null) {
                if(levelNo.length == 400) {
                    inUserLevel = true;
                    userLevel["array"] = createArrayFromCode(levelNo);
                    game.state.start("levelCreator");
                } else {
                    alert("Game number was invalid.");
                }
            }
        }
        if(this.cursorKeys.left.isDown && (keyCD["cursorKeys.left"] < game.time.now || keyCD["cursorKeys.left"] == undefined)) {
            keyCD["cursorKeys.left"] = game.time.now + 200;
            if (this.cursor[0] > 0) {
                this.cursor[0] --;
                this.cursorSprite.x = this.cursor[0]*20 + 20;
            }
        }
        if(this.cursorKeys.right.isDown && (keyCD["cursorKeys.right"] < game.time.now || keyCD["cursorKeys.right"] == undefined)) {
            keyCD["cursorKeys.right"] = game.time.now + 200;
            if (this.cursor[0] < 19) {
                this.cursor[0] ++;
                this.cursorSprite.x = this.cursor[0]*20 + 20;
            }
        }
        if(this.cursorKeys.up.isDown && (keyCD["cursorKeys.up"] < game.time.now || keyCD["cursorKeys.up"] == undefined)) {
            keyCD["cursorKeys.up"] = game.time.now + 200;
            if (this.cursor[1] > 0) {
                this.cursor[1] --;
                this.cursorSprite.y = this.cursor[1]*20 + 20;
            }
        }
        if(this.cursorKeys.down.isDown && (keyCD["cursorKeys.down"] < game.time.now || keyCD["cursorKeys.down"] == undefined)) {
            keyCD["cursorKeys.down"] = game.time.now + 200;
            if (this.cursor[1] < 19) {
                this.cursor[1] ++;
                this.cursorSprite.y = this.cursor[1]*20 + 20;
            }
        }
        
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
        this.switches = game.add.group(); // s
        this.doors = game.add.group(); // d
        
        // 20x20 level 
        
        var level = createMapFromArray(createArrayFromCode(levels[currentLevel]));
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
                    enemy.body.immovable = true;
                } else if (level[i][j] == '@') {
                    playerX = 20+20*j;
                    playerY = 20+20*i;
                } else if (level[i][j] == 's') {
                    var _switch = game.add.sprite(20+20*j,20+20*i,'switch');
                    this.switches.add(_switch);
                    _switch.isActiveSwitch = game.time.now - 1000;
                    _switch.body.immovable = true;
                    _switch.frame = 0;
                } else if (level[i][j] == 'd') {
                    var door = game.add.sprite(20+20*j,20+20*i,'door');
                    this.doors.add(door);
                    door.isActiveDoor = true;
                    door.body.immovable = true;
                    door.frame = 0;
                }
            }
        }
        
        this.player = game.add.sprite(playerX,playerY,'player');
        this.player.body.gravity.y = 1200;

        this.coins.setAll('body.mass',0);

        setDialog('main');
    },
    update: function() {
        game.physics.arcade.collide(this.player,this.walls);
        game.physics.arcade.collide(this.player,this.doors, null, this.checkDoorCollision, this);
        game.physics.arcade.collide(this.player,this.switches, null, this.activateSwitch, this);
        game.physics.arcade.collide(this.player,this.coins, null, this.takeCoin, this);
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
        return false;
    },
    activateSwitch: function(player, _switch) {
        if(game.time.now < _switch.isActiveSwitch)
            return false;

        _switch.isActiveSwitch = game.time.now + 1000;
        //_switch.frame = _switch.frame == 1 ? 0 : 1;
        for(var i = 0; i < this.doors.children.length; i++) {
            this.doors.children[i].isActiveDoor = !(this.doors.children[i].isActiveDoor);
            this.doors.children[i].frame = this.doors.children[i].isActiveDoor ? 0 : 1;
        }
        return false;
    },
    checkDoorCollision: function(player, door) {
        if(door.isActiveDoor)
            return true;
        
        return false;
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
