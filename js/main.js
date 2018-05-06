var Phaser, levels, $;

var tutorialShowing = false;

var game = new Phaser.Game(440, 440,Phaser.AUTO,"container");

// the 'mouse for controls' bit
// more can be added by adding .tutorial to elements
function showTutorial() {
    // fade in
    $(".tutorial").fadeTo(300,1);
    tutorialShowing = true;

    // in 2 seconds, fade out and set the control dialog to the current state
    setTimeout(function(){
        tutorialShowing = false;
        $(".tutorial").fadeTo(300,0);
        if (validStates.includes(game.state.current)) {
            setDialog(game.state.current);
        }
    },2000);
}

$("#popup").hide();
function showPopup(heading,content,onReturn) {
    $("#popup").show();
    $("#container").hide();
    $("#popup h1").text(heading);
    $("#levelcode").val(content);
    game.paused = true;
    game.input.enabled = false;
    $("#popup .confirm-button").on("click",() => {
        $(this).off();
        $("#container").show();
        $("#popup").hide()
        game.paused = false;
        game.input.enabled = true;
        onReturn($("#levelcode").val());
    });
}

// the controls dialog in the bottom of the screen
function setDialog(currentState) {
    $("#context-dialog .contents").css("display","none");
    if(!tutorialShowing) {
        var sectionID = currentState;
        
        // if the state's ID is different to the actual state, set the ID reference to the correct ID
        if (Object.keys(dialogIDOverrides).includes(currentState)) {
            sectionID = dialogIDOverrides[currentState]
        }

        if(validStates.includes(currentState)) {
            $("#context-dialog .contents#" + sectionID).css("display","block");
        }
        
    }
}

// sets the background colour so its all aesthetic
function setBackgroundColor(color) {
    game.stage.backgroundColor = color;
    document.body.style.backgroundColor = color;
    $("#context-dialog .contents").css("background-color",color);
}

// create a code
function createCodeFromMap(m) {
    var code = "";
    for(var y = 0; y < m.length; y++) {
        for(var x = 0; x < m[y].length; x++) {
            var item = m[y][x];
            code += item;
        }
    }
    return code;
}

function createMapFromCode(st) {
    return st.match(/.{20}/g).map((x) => x.split(''));
}

function runTimer () {
    timeSpent += 250;
}

// the level the user is making
var userLevel = [];
// the keys that are recently pressed
var keyCD = {};
// current level
var currentLevel = 0;
// amount of deaths
var deaths = 0;
// amount of deaths in total
var totalDeaths = 0;
// time spent
var timeSpent = 0;
// whether the user is making a level now
var inUserLevel = false;

// the state right at the start - sets up the loading state
var beginningState = {
    preload: function() {
        setBackgroundColor(mainBlue);
        game.load.image('loading', 'assets/loading.png');
        game.load.image('loading-bg', 'assets/loading-bg.png');
    },
    create: function() {
        game.state.add("loading", loadingState);
        game.state.start("loading");
    }
};

// the state that shows the loading bar while things load
var loadingState = {
    preload: function() {
        game.add.sprite(game.world.centerX - (440/2), game.world.centerY - (20/2), "loading-bg");
        var loadingBar = game.add.sprite(game.world.centerX - (440/2), game.world.centerY - (20/2), "loading");
        this.load.setPreloadSprite(loadingBar);
        
        setBackgroundColor(mainBlue);
        
        Object.keys(requiredImages).forEach((key) => {
            game.load.image(key,requiredImages[key]);
        });

        Object.keys(requiredSpritesheets).forEach((key) => {
            game.load.spritesheet(key,requiredSpritesheets[key],20,20)
        });

        game.forceSingleUpdate = true;
        game.renderer.renderSession.roundPixels = true;
        game.stage.disableVisibilityChange = true;
    },
    create: function() {
        game.state.add('main', mainState);
        game.state.add('menu',gameMenuState);
        game.state.add('death',deathState);
        game.state.add('levelComplete',levelCompleteState);
        game.state.add('end',successState);
        game.state.add("levelCreator", levelCreatorState);        

        game.state.start("menu");
        showTutorial();
    }
};
// the menu
var gameMenuState = {
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "what attitude?", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
        this.levCreText = game.make.text(game.world.centerX, game.world.centerY + 70, "[space] play\n\n[b] level maker", {
            font: '18px monospace',
            fill: 'rgba(255,255,255,0.6)',
            align: 'center'
        });
        this.levCreText.anchor.set(0.5);

        currentLevel = 0;
        deaths = 0;
        totalDeaths = 0;
    },
    create: function() {
        setBackgroundColor(mainBlue);
        game.add.existing(this.titleText);
        //game.add.existing(this.levCreText);
        this.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.KEY_B = game.input.keyboard.addKey(Phaser.Keyboard.B);
        setDialog('menu');
    },
    update: function() {
        if(this.KEY_SPACE.isDown) {
            game.state.start("main");
        } else if (this.KEY_B.isDown) {
            game.state.start("levelCreator");
        }
    }
};
// the death screen (bad attitude)
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
        setBackgroundColor(mainBlue);
        game.add.existing(this.titleText);

        this.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.KEY_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        
        if(!inUserLevel) {
            deaths ++;
            totalDeaths ++;
            if(deaths > 3) {
                this.titleText.text = "worst attitude.";
                setBackgroundColor(deathRed);
                deaths = 0;
                currentLevel = 0;
                // TODO: add deaths + time to worst attitude
            }
        }
        setDialog('between');
    },
    update: function() {
        if(this.KEY_SPACE.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("main");
            }
        }
        if(this.KEY_Q.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
            }
        }
    }
};
// the end screen (best attitude)
var successState = {
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "best attitude.", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
        this.timeSpentText = game.make.text(140, game.world.centerY + 40, 'an error has occurred', {
            font: '24px monospace',
            fill: 'rgba(255,255,255,1)',
            align: 'left'
        });
        this.timeSpentText.anchor.set(0,0.5);
        this.deathsText = game.make.text(game.world.width - 140, game.world.centerY + 40, 'an error has occurred', {
            font: '24px monospace',
            fill: 'rgba(255,255,255,1)',
            align: 'right'
        });
        this.deathsText.anchor.set(0,0.5);
    },
    create: function() {
        setBackgroundColor(successGreen);
        setDialog('end');
        
        game.add.existing(this.titleText);
        game.add.existing(this.timeSpentText);
        game.add.existing(this.deathsText);

        // putting icons next to text
        this.timeSpentIcon = game.add.sprite(this.timeSpentText.left - 5, this.timeSpentText.y - 4, 'clockicon');
        this.timeSpentIcon.anchor.set(1,0.5);
        this.timeSpentIcon.alpha = 0.7;
        this.deathsIcon = game.add.sprite(this.deathsText.left - 5, this.deathsText.y - 4, 'skullicon');
        this.deathsIcon.anchor.set(1,0.5);
        this.deathsIcon.alpha = 0.7;

        // filling out text
        this.timeSpentText.text = Math.floor(timeSpent / 1000);
        this.deathsText.text = totalDeaths;

        this.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.KEY_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);

        // reset all variables
        currentLevel = 0;
        deaths = 0;
        totalDeaths = 0;
        timeSpent = 0;
    },
    update: function() {
        if(this.KEY_Q.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
            }
        }

        if(this.KEY_SPACE.isDown) {
            this.timeSpentIcon.alpha = 0.7;
            this.timeSpentText.alpha = 0.7;
            this.deathsIcon.alpha = 0.7;
            this.deathsText.alpha = 0.7;
        } else {
            this.timeSpentIcon.alpha = 0;
            this.timeSpentText.alpha = 0;
            this.deathsIcon.alpha = 0;
            this.deathsText.alpha = 0;
        }
    }
};

// the level complete screen (good attitude)
var levelCompleteState = {
    init: function() {
        this.titleText = game.make.text(game.world.centerX, game.world.centerY, "good attitude.", {
            font: 'bold 40px monospace',
            fill: '#fff',
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
    },
    create: function() {
        setBackgroundColor(mainBlue);
        game.add.existing(this.titleText);

        this.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.KEY_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        
        // increment levels
        if(!inUserLevel) {
            currentLevel ++;
            deaths = 0;
            if (currentLevel >= levels.length) {
                game.state.start('end');
            }
        }

        setDialog('between');
    },
    update: function() {
        if(inUserLevel) {
            if(this.KEY_SPACE.isDown || this.KEY_Q.isDown) {
                game.state.start("levelCreator");
            }
        } else {
            if(this.KEY_SPACE.isDown)
                game.state.start("main");
            if (this.KEY_Q.isDown)
                game.state.start("menu");
        }
    }
};
// the level creator state
var levelCreatorState = {
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
        setBackgroundColor(mainBlue);
        this.cursor = [0,0];
        
        this.map = 
        [//   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        game.add.sprite(0,0,'outline');
        
        // keybinds
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
        this.KEY_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);

        this.cursorKeys = game.input.keyboard.createCursorKeys();
        
        this.buildingBlocks = game.add.group();
        
        // if already in a user level, show the existing one
        if (inUserLevel) {
            this.map = userLevel;
            inUserLevel = false;
            
            for (var i = 0; i < this.map.length; i++) {
                for (var j = 0; j < this.map[i].length; j++) {
                    
                    var thisTile = this.map[i][j];

                    if(thisTile > 0) {
                        var tileSprite = tileNames[thisTile];
                        var frame = 0;

                        // closed door
                        if (thisTile == 6) {
                            tileSprite = "door";
                        // open door
                        } else if (thisTile == 7) {
                            frame = 1;
                            tileSprite = "door";
                        }

                        var tile = game.add.sprite(20+20*j,20+20*i,tileSprite);
                        tile.frame = frame
                        this.buildingBlocks.add(tile);
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
        // place wall
        if(this.isKeyActive("wallKey")) {
            this.killSprites();
            this.map[this.cursor[1]][this.cursor[0]] = 1;
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'wall'));
        }
        // place coin
        if(this.isKeyActive("coinKey")) {
            this.killSprites();
            this.map[this.cursor[1]][this.cursor[0]] = 2;
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'coin'));
        }
        // place enemy
        if(this.isKeyActive("enemyKey")) {
            this.killSprites();
            this.map[this.cursor[1]][this.cursor[0]] = 3;
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'enemy'));
        }
        // place player
        if(this.isKeyActive("playerKey")) {
            this.killSprites();
            this.map[this.cursor[1]][this.cursor[0]] = 4;
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'player'));
        }
        // place switch
        if(this.isKeyActive("switchKey")) {
            this.killSprites();
            this.map[this.cursor[1]][this.cursor[0]] = 5;
            this.buildingBlocks.add(game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'switch'));
        }
        // place door
        if(this.isKeyActive("doorKey")) {
            this.killSprites();
            var tempSprite = game.add.sprite(20+20*this.cursor[0],20+20*this.cursor[1],'door');

            if(this.doorKey.shiftKey == false) {
                this.map[this.cursor[1]][this.cursor[0]] = 6;
            } else {
                this.map[this.cursor[1]][this.cursor[0]] = 7;
                tempSprite.frame = 1;
            }

            this.buildingBlocks.add(tempSprite);
        }
        // remove elements
        if(this.isKeyActive("deleteKey")) {
            this.killSprites();
        }
        // plays the level
        if(this.submitKey.isDown) {
            userLevel = this.map;
            inUserLevel = true;
            this.removeEventListeners();
            game.state.start("main");
        }
        // gives the game number
        if(this.isKeyActive("debugKey")) {
            showPopup("get level code", createCodeFromMap(this.map),()=>{});
        }
        // takes the game number
        if(this.isKeyActive("openKey")) {
            showPopup("load a level", "",(levelNo)=>{
                if(levelNo != null) {
                    if(levelNo.length == 400) {
                        inUserLevel = true;
                        userLevel = createMapFromCode(levelNo);
                        game.state.start("levelCreator");
                    } else {
                        showPopup("error","level number was invalid");
                    }
                }
            });
        }
        // sets this.cursor 
        if(this.isCursorKeyActive("left")) {
            if (this.cursor[0] > 0) {
                this.cursor[0] --;
                this.cursorSprite.x = this.cursor[0]*20 + 20;
            }
        }
        if(this.isCursorKeyActive("right")) {
            if (this.cursor[0] < 19) {
                this.cursor[0] ++;
                this.cursorSprite.x = this.cursor[0]*20 + 20;
            }
        }
        if(this.isCursorKeyActive("up")) {
            if (this.cursor[1] > 0) {
                this.cursor[1] --;
                this.cursorSprite.y = this.cursor[1]*20 + 20;
            }
        }
        if(this.isCursorKeyActive("down")) {
            if (this.cursor[1] < 19) {
                this.cursor[1] ++;
                this.cursorSprite.y = this.cursor[1]*20 + 20;
            }
        }
        
        // quit user level
        if (this.KEY_Q.isDown) {
            inUserLevel = false;
            this.removeEventListeners();
            game.state.start("menu");
        }
    },
    isKeyActive: function(key) {
        if(this[key].isDown && (keyCD[key] < game.time.now || keyCD[key] == undefined)) {
            keyCD[key] = game.time.now + 200;
            return true;
        }
        return false;
    },
    isCursorKeyActive: function(cKey) {
        if(this.cursorKeys[cKey].isDown && (keyCD["cursorKeys." + cKey] < game.time.now || keyCD["cursorKeys." + cKey] == undefined)) {
            keyCD["cursorKeys." + cKey] = game.time.now + 200;
            return true;
        }
        return false;
    },
    // kills the sprites where a mouse cursor is
    killSprites: function () {
        this.map[this.cursor[1]][this.cursor[0]] = "0";
        for (var i = 0; i < this.buildingBlocks.children.length; i++) {
            if(
                (this.buildingBlocks.children[i].x/20) - 1 == this.cursor[0] &&
                (this.buildingBlocks.children[i].y/20) - 1 == this.cursor[1]
            ) {
                this.buildingBlocks.children[i].kill();
            }
        }
    }
};
// the game state
var mainState = {
    create: function() {
        setBackgroundColor(mainBlue);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
        
        this.cursorKeys = game.input.keyboard.createCursorKeys();
        this.KEY_W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.KEY_A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.KEY_D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.KEY_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.KEY_SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.KEY_X = game.input.keyboard.addKey(Phaser.Keyboard.X);
        
        this.walls = game.add.group(); // x
        this.coins = game.add.group(); // o
        this.enemies = game.add.group(); // !
        this.switches = game.add.group(); // s
        this.doors = game.add.group(); // d
        
        // 20x20 level 
        
        var level = createMapFromCode(levels[currentLevel]);
        if (inUserLevel) {
            level = userLevel;
        }

        // sets player location
        var playerX = 60;
        var playerY = 100;
        
        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {
                if (level[i][j] == '1') {
                    var wall = game.add.sprite(20+20*j,20+20*i,'wall');
                    wall.body.immovable = true;
                    this.walls.add(wall);
                } else if (level[i][j] == '2') {
                    var coin = game.add.sprite(20+20*j,20+20*i,'coin');
                    this.coins.add(coin);
                } else if (level[i][j] == '3') {
                    var enemy = game.add.sprite(20+20*j,20+20*i,'enemy');
                    enemy.body.immovable = true;
                    this.enemies.add(enemy);
                } else if (level[i][j] == '4') {
                    playerX = 20+20*j;
                    playerY = 20+20*i;
                } else if (level[i][j] == '5') {
                    var _switch = game.add.sprite(20+20*j,20+20*i,'switch');
                    this.switches.add(_switch);
                    _switch.isActiveSwitch = game.time.now - 1000;
                    _switch.body.immovable = true;
                    _switch.frame = 0;
                } else if (level[i][j] == '6' || level[i][j] == '7') {
                    var door = game.add.sprite(20+20*j,20+20*i,'door');
                    this.doors.add(door);
                    door.isActiveDoor = (level[i][j] == '6');
                    door.body.immovable = true;
                    
                    door.frame = 0;
                    if(level[i][j] == '7')
                        door.frame = 1;
                }
            }
        }
        
        // adds player
        this.player = game.add.sprite(playerX,playerY,'player');
        this.player.body.gravity.y = 1200;

        this.coins.setAll('body.mass',0);

        setDialog('main');

        if(!inUserLevel) {
            game.time.events.loop(250, runTimer, this);
        }
    },
    update: function() {
        // handle collisions
        game.physics.arcade.collide(this.player,this.walls);
        game.physics.arcade.collide(this.player,this.doors, null, this.checkDoorCollision, this);
        game.physics.arcade.collide(this.player,this.switches, null, this.activateSwitch, this);
        game.physics.arcade.collide(this.player,this.coins, null, this.takeCoin, this);
        game.physics.arcade.collide(this.player,this.enemies, this.death, null, this);
        
        // move the player
        if (this.cursorKeys.left.isDown || this.KEY_A.isDown)
            this.player.body.velocity.x = -200;
        else if (this.cursorKeys.right.isDown || this.KEY_D.isDown)
            this.player.body.velocity.x = 200;
        else
            this.player.body.velocity.x = 0;
        
        if ((this.cursorKeys.up.isDown || this.KEY_SPACE.isDown || this.KEY_W.isDown) && this.player.body.touching.down)
            this.player.body.velocity.y = -380;
        
        // pass the level if hit all coins
        if(this.coins.total == 0) {
            this.passLevel();
        }
        
        // kys if want to die
        if(this.KEY_X.isDown) {
            this.death();
        }
    
        // quit to menu
        if(this.KEY_Q.isDown) {
            if(inUserLevel) {
                game.state.start("levelCreator");
            } else {
                game.state.start("menu");
            }
        }

        // if the player's fallen out
        if(this.player.x < -20 || this.player.y > 420 || this.player.y > 421 -20) {
            this.onPlayerLeaveBounds();
        }
    },
    takeCoin: function(player,coin) {
        coin.kill();
        // prevents the player from double jumping
        this.player.body.touching.down = false;
        return false;
    },
    // activates the switch
    activateSwitch: function(player, _switch) {
        if(game.time.now < _switch.isActiveSwitch)
            return false;

        // TODO: i don't understand why isActiveSwitch is called that - seems more like a timer, timeSwitchFlipped would be better?
        _switch.isActiveSwitch = game.time.now + 1000;
        for(var i = 0; i < this.doors.children.length; i++) {
            this.doors.children[i].isActiveDoor = !(this.doors.children[i].isActiveDoor);
            this.doors.children[i].frame = this.doors.children[i].isActiveDoor ? 0 : 1;
        }
        return false;
    },
    // special door collision - checks if its active
    checkDoorCollision: function(player, door) {
        if(door.isActiveDoor)
            return true;
        
        return false;
    },
    death: function() {
        game.state.start('death');
        if(!inUserLevel)
            game.time.events.remove(runTimer);
    },
    passLevel: function() {
        game.state.start('levelComplete');
        if(!inUserLevel)
            game.time.events.remove(runTimer);
    },
    onPlayerLeaveBounds: function () {
        this.death();
    }
};

// begins the game - the only actual code that runs :P
game.state.add("beginning",beginningState);
game.state.start('beginning');