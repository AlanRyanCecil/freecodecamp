'use strict';

let game,
    gameTitle = 'The Lost Dungeon',
    dungeonArray,
    player,
    maxVelocity,
    playerSize = Math.round(window.innerWidth / 105),
    //16,
playerAcceleration = Math.round(window.innerWidth / 512),
    paused,
    visibleArea,
    visibleSize,
    itemSize,
    vitality,
    vitalityLabel,
    weapons,
    population,
    enemies,
    enemySize,
    enemyStrength,
    redStrength,
    greenStrength,
    blueStrength,
    boss,
    bossSize,
    bossStunned,
    gemSize,
    gemRed,
    gemGreen,
    gemBlue,
    gemYellow,
    bossFill,
    gemCase,
    gemDisplayRed,
    gemDisplayGreen,
    gemDisplayBlue,
    gemDisplayYellow,
    gemDisplaySize,
    gemsCaptured = 0,
    mazeSize,
    roomCount,
    roomSize,
    mazeGroup,
    mazeCellSize,
    mazeFill,
    mazeStroke,
    mazeObject,
    encounterGroup,
    hitOrRun,
    hitOrRunActive,
    worldWidth,
    display,
    displayJustify,
    displayLeading,
    meterWidth,
    meterHeight,
    meterX,
    meterY,
    levelDisplay,
    score,
    scoreLabel,
    scoreDisplay,
    lifeMeter,
    lifeLabel,
    lifeMeterBG,
    powerLabel,
    powerMeter,
    powerMeterBG,
    currentPower,
    style,
    cursors,
    colorPalette = {
    blue: 0x3366FF,
    lightBlue: 0x55AAEE,
    brightBlue: 0xCEF2FF,
    yellow: 0xFFDD22,
    orange: 0xFBAA09,
    red: 0xFF2222,
    green: 0x88FF22,
    gemRed: 0xFF11BB,
    gemGreen: 0x00FF00,
    gemBlue: 0x4800FF,
    gemYellow: 0xFFF400
},
    playerRoom = 15,
    levelColor,
    playerColor = 0x3366FF,
    playerArmedColor = 0x222222,
    vitalityColor = 0x55AAEE,
    weaponColor = 0xFFDD22,
    win,
    level = 1;
levelColor = {
    1: 0xFBAA09,
    2: 0xF73F0E,
    3: 0x425B70
}, enemyStrength = {
    0: 0x88FF22,
    1: 0xEE5522,
    2: 0xFF2222
};

style = {
    font: 'Black Ops One, Arial',
    // font: 'Codystar,  Arial',
    fill: '#F03108',
    fontSize: '4vh'
};

function resetGame() {
    population = {
        player: 1,
        weapons: 52,
        vitality: 52,
        evil: 40 //86
    };
    score = 0;
    level = 1;
    win = false;
    paused = false;
}
resetGame();

let StateMain = {
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();

        visibleSize = Math.round(window.innerWidth / 168); //10 size in cells
        maxVelocity = Math.round(window.innerWidth / 10); //500;

        itemSize = Math.round(window.innerWidth / 132);

        enemySize = Math.round(window.innerWidth / 105);
        mazeCellSize = Math.round(window.innerWidth / 70); //24;
        mazeSize = 64;
        roomCount = 32;
        roomSize = 16;
        mazeFill = 0xFBAA09;
        mazeStroke = 0x222222;
        mazeObject = {};
        worldWidth = mazeCellSize * mazeSize + window.innerWidth;
        game.world.setBounds(0, 0, worldWidth, worldWidth);

        dungeonArray = new Bungeon(mazeSize, roomCount, roomSize);
        let tRows = new Array();
        mazeGroup = game.add.group();

        visibleArea = game.add.graphics(playerSize / 2, playerSize / 2);
        visibleArea.drawCircle(0, 0, visibleSize * mazeCellSize);
        visibleArea.anchor.set(0.5, 0.5);

        player = game.add.graphics(0, 0);
        player.beginFill(playerColor);
        player.drawRect(0, 0, playerSize, playerSize);
        player.endFill();
        player.addChild(visibleArea);
        player.name = 'player';
        player.vitality = 100;

        game.camera.follow(player);

        this.initMaze();
        this.populate(mazeObject);

        game.physics.enable([player], Phaser.Physics.ARCADE);
        player.body.bounce.set(0.1);
        player.body.collideWorldBounds = true;

        displayJustify = Math.round(window.innerWidth / 20);
        displayLeading = Math.round(window.innerHeight / 30);
        meterWidth = Math.round(window.innerWidth / 7);
        meterHeight = Math.round(window.innerHeight / 52);
        meterX = displayJustify + Math.round(window.innerWidth / 70);
        meterY = Math.round(window.innerHeight / 12);

        display = game.add.group();
        display.fixedToCamera = true;

        levelDisplay = game.make.text(0, 0, 'level - ' + level, style);
        levelDisplay.x = window.innerWidth - levelDisplay.width - displayJustify;
        levelDisplay.y = displayLeading;
        display.add(levelDisplay);

        scoreDisplay = game.make.text(displayJustify, displayLeading, 'score - ' + score, style);
        display.add(scoreDisplay);
        vitalityLabel = game.make.text(displayJustify, displayLeading * 2, 'vitality', style);
        display.add(vitalityLabel);
        powerLabel = game.make.text(displayJustify, displayLeading * 3, 'power', style);
        display.add(powerLabel);

        lifeMeterBG = game.make.graphics(meterX + vitalityLabel.width, meterY);
        lifeMeterBG.beginFill(0x2E110B);
        lifeMeterBG.drawRect(0, 0, meterWidth, meterHeight);
        lifeMeterBG.endFill();
        lifeMeter = game.make.graphics(meterX + vitalityLabel.width, meterY);
        lifeMeter.beginFill(0x3366FF);
        lifeMeter.drawRect(0, 0, meterWidth, meterHeight);
        lifeMeter.endFill();
        display.add(lifeMeterBG);
        display.add(lifeMeter);

        powerMeterBG = game.make.graphics(meterX + vitalityLabel.width, meterY * 1.42);
        powerMeterBG.beginFill(0x2E110B);
        powerMeterBG.drawRect(0, 0, meterWidth, meterHeight);
        powerMeterBG.endFill();
        powerMeter = game.make.graphics(meterX + vitalityLabel.width, meterY * 1.42);
        powerMeter.beginFill(0xABF900);
        powerMeter.drawRect(0, 0, meterWidth, meterHeight);
        powerMeter.endFill();
        powerMeter.scale.x = 0;
        display.add(powerMeterBG);
        display.add(powerMeter);

        game.time.events.loop(512, this.enemyMovement, this);
        setTimeout(_ => {
            // this.encounter();
        }, 1000);
        console.log(player);
    },

    unpause: function (event) {
        if (game.paused) {
            game.paused = false;
        }
        console.log(event);
    },

    isWall: function (row, col, maze) {
        if (row === 0 || row === maze.length - 1 || col === 0 || col === maze.length - 1) {
            return true;
        }
        if (0 < row && row < maze.length - 1 && 0 < col && col < maze.length - 1) {
            if (maze[row - 1][col - 1] || maze[row - 1][col] || maze[row - 1][col + 1] || maze[row][col - 1] || maze[row][col + 1] || maze[row + 1][col - 1] || maze[row + 1][col] || maze[row + 1][col + 1]) {
                return true;
            } else {
                return false;
            }
        }
    },

    makeBlock: function (rowIndex, colIndex) {
        let block = game.make.graphics(mazeCellSize * colIndex + window.innerWidth / 2, mazeCellSize * rowIndex + window.innerWidth / 2);
        block.lineStyle(1, mazeStroke, 1);
        block.beginFill(levelColor[level]);
        block.drawRect(0, 0, mazeCellSize, mazeCellSize);
        block.endFill();
        game.physics.enable(block, Phaser.Physics.ARCADE);
        block.body.immovable = true;
        return block;
    },

    getRoom: function () {
        let room = game.rnd.integerInRange(2, Object.keys(mazeObject).length - 1);
        return room !== playerRoom ? room : this.getRoom();
    },

    getCell: function (room) {
        return game.rnd.integerInRange(0, mazeObject[room].length - 1);
    },

    makeVitality: function () {
        let i,
            vital,
            room = this.getRoom(),
            cell = this.getCell(room);

        vital = game.make.graphics();
        vital.beginFill(vitalityColor);
        vital.drawRect(0, 0, itemSize, itemSize);
        vital.endFill();

        vital.position.x = mazeCellSize * mazeObject[room][cell][1] + window.innerWidth / 2;
        vital.position.y = mazeCellSize * mazeObject[room][cell][0] + window.innerWidth / 2;
        game.physics.enable(vital, Phaser.Physics.ARCADE);
        vital.body.immovable = true;
        vitality.add(vital);
    },

    makeWeapons: function () {
        let i,
            weapon,
            room = this.getRoom(),
            cell = this.getCell(room);

        weapon = game.make.graphics();
        weapon.beginFill(weaponColor);
        weapon.drawRect(0, 0, itemSize, itemSize);
        weapon.endFill();

        weapon.position.x = mazeCellSize * mazeObject[room][cell][1] + window.innerWidth / 2;
        weapon.position.y = mazeCellSize * mazeObject[room][cell][0] + window.innerWidth / 2;
        game.physics.enable(weapon, Phaser.Physics.ARCADE);
        weapon.body.immovable = true;
        weapons.add(weapon);
    },

    makeEnemies: function () {
        let velocity = Math.floor(window.innerWidth / 20),
            strength = game.rnd.integerInRange(0, 2),
            vitality = game.rnd.integerInRange(10, 100),
            x,
            foe,
            room = this.getRoom(),
            cell = this.getCell(room);

        foe = game.make.graphics();
        foe.name = 'foe';
        foe.strength = strength;
        foe.vitality = vitality;
        foe.beginFill(enemyStrength[strength]);
        foe.drawRect(0, 0, enemySize, enemySize);
        foe.endFill();

        foe.position.x = mazeCellSize * mazeObject[room][cell][1] + window.innerWidth / 2;
        foe.position.y = mazeCellSize * mazeObject[room][cell][0] + window.innerWidth / 2;

        game.physics.enable(foe, Phaser.Physics.ARCADE);
        foe.body.velocity.x = game.rnd.integerInRange(-velocity, velocity);
        foe.body.velocity.y = game.rnd.integerInRange(-velocity, velocity);
        foe.body.bounce.set(1);
        enemies.add(foe);
    },

    populate: function (maze) {
        let roomCount = Object.keys(maze).length - 1,
            room,
            i,
            center15 = Math.floor(maze[playerRoom].length / 2);

        player.position.x = mazeCellSize * maze[playerRoom][center15][1] + window.innerWidth / 2;
        player.position.y = mazeCellSize * maze[playerRoom][center15][0] + window.innerWidth / 2;

        vitality = game.add.group();
        for (i = 0; i < population.vitality; i++) {
            if (i !== playerRoom) {
                this.makeVitality();
            }
        }

        weapons = game.add.group();
        for (i = 0; i < population.weapons; i++) {
            if (i !== playerRoom) {
                this.makeWeapons();
            }
        }

        enemies = game.add.group();
        for (i = 0; i < population.evil; i++) {
            if (i !== playerRoom) {
                this.makeEnemies();
            }
        }
    },

    initMaze: function () {
        let block;

        dungeonArray.maze.map((row, rowIndex, maze) => {
            row.map((cell, colIndex) => {
                if (rowIndex === 0 || colIndex === 0) {
                    cell = 0;
                }
                if (!cell && this.isWall(rowIndex, colIndex, maze)) {
                    block = this.makeBlock(rowIndex, colIndex);
                    mazeGroup.add(block);
                }
                if (mazeObject[cell]) {
                    mazeObject[cell].push([rowIndex, colIndex]);
                } else {
                    mazeObject[cell] = [[rowIndex, colIndex]];
                }
            });
        });
    },

    makeBossRoom: function () {
        let size = Math.round(window.innerWidth / 72),
            rowLength = Math.floor(window.innerWidth / size),
            columnLength = Math.floor(window.innerHeight / size),
            row = new Array(rowLength).fill(0),
            matrix = new Array(columnLength).fill(row);

        return matrix;
    },

    colorChange: function (block, color) {
        block.clear();
        block.beginFill(color);
        block.drawRect(0, 0, block.width, block.height);
        block.endFill();
    },

    hide: function (things) {
        things.map(thing => {
            thing.children.map(t => t.alpha = 0);
        });
    },

    show: function (things) {
        things.map(thing => {
            game.physics.arcade.overlap(thing, visibleArea, (area, block) => {
                block.alpha = 1;
            });
        });
    },

    nextLevel: function () {
        level++;
        score = 0;
        player.hasWeapon = false;
        population.weapons = Math.floor(population.weapons * 0.8);
        population.evil = Math.ceil(population.evil * 1.2);

        if (level === 4) {
            game.state.start('StateBoss');
        } else {
            game.state.start('StateNext');
        }
    },

    die: function (life) {
        let xx = life.x - life.width / 2 * 5,
            yy = life.y - life.height / 2 * 5;
        if (life.name === 'player') {
            game.camera.follow(null);
        }
        life.body.enable = false;
        game.add.tween(life.scale).to({ x: 5, y: 5 }, 500, Phaser.Easing.Linear.None, true);
        game.add.tween(life).to({ x: xx, y: yy }, 500, Phaser.Easing.Linear.None, true);
        game.add.tween(life).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
        if (life.name === 'foe') {
            setTimeout(_ => {
                life.destroy();
            }, 320);
        }
    },

    gameOver: function () {
        game.lockRender = true;
        setTimeout(_ => {
            game.lockRender = false;
            game.state.start('StateOver');
        }, 1000);
    },

    playerControl: function () {
        let x = player.body.velocity.x,
            y = player.body.velocity.y,
            velocitySquare = x * x + y * y,
            angle;

        if (velocitySquare > Math.pow(maxVelocity, 2)) {
            angle = Math.atan2(y, x);
            x = Math.cos(angle) * maxVelocity;
            y = Math.sin(angle) * maxVelocity;
            player.body.velocity.x = x;
            player.body.velocity.y = y;
        }

        if (cursors.left.isDown) {
            player.body.velocity.x -= playerAcceleration;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x += playerAcceleration;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y -= playerAcceleration;
        }
        if (cursors.down.isDown) {
            player.body.velocity.y += playerAcceleration;
        }
    },

    enemyMovement: function () {
        if (!paused) {
            enemies.children.map(foe => {
                let split = Math.floor(Math.random() * 3);
                if (!split) {
                    let velocity = Math.floor(window.innerWidth / 20),
                        vx = game.rnd.integerInRange(-velocity, velocity),
                        vy = game.rnd.integerInRange(-velocity, velocity);

                    game.add.tween(foe.body.velocity).to({ x: vx, y: vy }, 500, Phaser.Easing.Linear.None, true);
                }
            });
        }
    },

    powerMeterLevel: function () {
        let moment = Math.abs(player.body.velocity.x) + Math.abs(player.body.velocity.y);
        currentPower = Number((moment / maxVelocity).toFixed(2));
        let x = currentPower < 1 ? currentPower : 1;

        game.add.tween(powerMeter.scale).to({ x: x }, 64, Phaser.Easing.Linear.None, true);
        // powerMeter.scale.x = currentPower < 1 ? currentPower : 1;
    },

    getVitality: function (player, vital) {
        if (player.vitality < 100) {
            let heal = Math.min(game.rnd.integerInRange(5, 30), 100 - player.vitality);
            player.vitality += heal;
            vital.destroy();
            let x = Number((player.vitality / 100).toFixed(2));
            game.add.tween(lifeMeter.scale).to({ x: x }, 500, Phaser.Easing.Linear.None, true);
            this.displayDamage(heal, false, true);
        }
    },

    getWeapon: function (player, weapon) {
        if (!player.hasWeapon) {
            player.clear();
            player.beginFill(playerArmedColor);
            player.lineStyle(2, weaponColor);
            player.drawRect(0, 0, playerSize, playerSize);
            player.endFill();
            weapon.destroy();
            player.hasWeapon = true;
        }
    },

    useWeapon: function () {
        player.clear();
        player.beginFill(playerColor);
        player.drawRect(0, 0, playerSize, playerSize);
        player.endFill();
        player.hasWeapon = false;
    },

    endEncounter: function () {
        game.add.tween(encounterGroup).to({ alpha: 0 }, 128, Phaser.Easing.Linear.None, true);
        setTimeout(_ => {
            encounterGroup.destroy();
            paused = false;
        }, 128);
    },

    displayDamage: function (hit, attack, heal) {
        let moreOrLess = '-',
            hitFill = '#FF2222';
        if (heal) {
            moreOrLess = '+';
            hitFill = '#3366FF';
        }
        let damage = game.add.text(0, 0, moreOrLess + hit, style),
            xx = game.camera.x + game.camera.width * 0.8,
            yy = game.camera.y + game.camera.height * 0.25,
            xAnim = Math.floor(game.camera.width / 16);

        if (attack) {
            xx = game.camera.x + game.camera.width * 0.2;
            xAnim *= -1;
        }

        damage.fontSize = '12vh';
        damage.fill = hitFill;
        damage.anchor.set(0.5);
        damage.x = xx - xAnim;
        damage.y = yy;
        damage.scale.x = 0;
        damage.scale.y = 0;
        damage.alpha = 0;
        game.add.tween(damage).to({ x: xx + xAnim }, 1800, Phaser.Easing.Linear.None, true);
        game.add.tween(damage).to({ alpha: 1 }, 800, Phaser.Easing.Linear.None, true);
        game.add.tween(damage.scale).to({ x: 1, y: 1 }, 1800, Phaser.Easing.Linear.None, true);
        setTimeout(_ => {
            game.add.tween(damage).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
        }, 800);
        setTimeout(_ => {
            damage.destroy();
        }, 1800);
    },

    doDamage: function (foe) {
        let damage = game.rnd.integerInRange(1, player.vitality * currentPower);
        foe.vitality -= damage;
        this.displayDamage(damage, true);
    },

    takeDamage: function (foe) {
        let damage = game.rnd.integerInRange(1, Math.floor(foe.vitality / 2));
        player.vitality -= damage;
        let playerVitality = (player.vitality / 100).toFixed(2);
        playerVitality = playerVitality >= 0 ? Number(playerVitality) : 0;
        game.add.tween(lifeMeter.scale).to({ x: playerVitality }, 500, Phaser.Easing.Linear.None, true);
        this.displayDamage(damage);
    },

    hit: function (button, pointer, foe) {
        if (hitOrRunActive) {
            hitOrRunActive = false;
            game.add.tween(hitOrRun).to({ alpha: 0 }, 128, Phaser.Easing.Linear.None, true);
            this.doDamage(foe);
            if (foe.vitality <= 0) {
                score++;
                scoreDisplay.text = 'score - ' + score;
                this.useWeapon();
                this.endEncounter();
                this.die(foe);
                if (score >= 3) {
                    setTimeout(_ => {
                        this.nextLevel();
                    }, 500);
                }
            } else {
                setTimeout(_ => {
                    this.takeDamage(foe);
                }, 500);
                if (player.vitality <= 0) {
                    this.die(player);
                    setTimeout(_ => {
                        this.gameOver();
                    }, 360);
                } else {
                    setTimeout(_ => {
                        game.add.tween(hitOrRun).to({ alpha: 1 }, 128, Phaser.Easing.Linear.None, true);
                        setTimeout(_ => {
                            hitOrRunActive = true;
                        }, 128);
                    }, 800);
                }
            }
        }
    },

    run: function (button, pointer, foe) {
        this.takeDamage(foe);
        foe.justEncountered = true;
        setTimeout(_ => {
            foe.justEncountered = false;
        }, 1000);
        this.endEncounter();
    },

    encounter: function (player, foe) {
        if (!player.hasWeapon) {
            this.die(player);
            setTimeout(_ => {
                this.gameOver();
            }, 360);
            return;
        }

        if (foe.justEncountered) {
            return;
        }

        hitOrRunActive = true;

        setTimeout(_ => {
            foe.body.velocity.x = 0;
            foe.body.velocity.y = 0;
        }, 100);
        encounterGroup = game.add.group();
        hitOrRun = game.make.group();
        paused = true;

        let avitarSize = Math.floor(game.camera.width / 8),
            buttonSpread = Math.floor(game.camera.width / 5),
            duelX = game.camera.x + Math.floor(game.camera.width / 2),
            duelY = game.camera.y + Math.floor(game.camera.height / 2);

        let fade = game.make.graphics();
        fade.beginFill(0x000000, 0.6);
        fade.drawRect(0, 0, 500, 500);
        fade.endFill();
        fade.x = duelX - fade.width / 2;
        fade.y = duelY - fade.width / 2;

        let fighter = game.make.graphics();
        fighter.beginFill(foe.graphicsData[0].fillColor);
        fighter.drawRect(0, 0, avitarSize, avitarSize);
        fighter.endFill();
        fighter.x = duelX - avitarSize * 1.5;
        fighter.y = duelY - avitarSize;

        let avitar = game.make.graphics();
        avitar.beginFill(playerColor);
        avitar.drawRect(0, 0, avitarSize, avitarSize);
        avitar.endFill();
        avitar.x = duelX + avitarSize * 0.5;
        avitar.y = duelY - avitarSize;

        let hitText = game.make.text(0, 0, 'hit', style);
        hitText.anchor.set(0.5);
        hitText.fontSize = '7vh';
        hitText.fill = '#000000';
        hitText.x = duelX - buttonSpread;
        hitText.y = duelY + hitText.height * 1.5;

        let hitBG = game.make.graphics();
        hitBG.beginFill(colorPalette.green);
        hitBG.drawRoundedRect(0, 0, hitText.width * 1.2, hitText.height, Math.round(window.innerWidth / 168));
        hitBG.endFill();
        hitBG.x = hitText.x - hitBG.width / 2;
        hitBG.y = hitText.y - hitBG.height / 2;
        hitBG.inputEnabled = true;
        hitBG.events.onInputDown.add(this.hit, this, null, foe);

        let orText = game.make.text(0, 0, 'or', style);
        orText.anchor.set(0.5);
        orText.fontSize = '7vh';
        orText.fill = '#FFFFFF';
        orText.x = duelX;
        orText.y = duelY + orText.height * 1.5;

        let runText = game.make.text(0, 0, 'run', style);
        runText.anchor.set(0.5);
        runText.fontSize = '7vh';
        runText.fill = '#000000';
        runText.x = duelX + buttonSpread;
        runText.y = duelY + runText.height * 1.5;

        let runBG = game.make.graphics();
        runBG.beginFill(colorPalette.red);
        runBG.drawRoundedRect(0, 0, runText.width * 1.2, runText.height, Math.round(window.innerWidth / 168));
        runBG.endFill();
        runBG.x = runText.x - runBG.width / 2;
        runBG.y = runText.y - runBG.height / 2;
        runBG.inputEnabled = true;
        runBG.events.onInputDown.add(this.run, this, null, foe);

        encounterGroup.alpha = 0;
        encounterGroup.add(fade);
        encounterGroup.add(fighter);
        encounterGroup.add(avitar);
        encounterGroup.add(hitOrRun);
        hitOrRun.add(hitBG);
        hitOrRun.add(hitText);
        hitOrRun.add(orText);
        hitOrRun.add(runBG);
        hitOrRun.add(runText);
        game.add.tween(encounterGroup).to({ alpha: 1 }, 128, Phaser.Easing.Linear.None, true);
    },

    update: function () {
        this.hide([mazeGroup, enemies, vitality, weapons]);
        this.show([mazeGroup, enemies, vitality, weapons]);

        if (!paused) {
            game.physics.arcade.collide(player, mazeGroup);
            game.physics.arcade.collide(player, vitality, this.getVitality, null, this);
            game.physics.arcade.collide(player, weapons, this.getWeapon);
            game.physics.arcade.collide(player, enemies, this.encounter, null, this);
            game.physics.arcade.collide(enemies);

            this.playerControl();
            this.powerMeterLevel();
        } else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
        game.physics.arcade.collide(enemies, mazeGroup);
        game.physics.arcade.collide(enemies, vitality);
        game.physics.arcade.collide(enemies, weapons);
    }
};

let StateTitle = {
    startGame: function () {
        game.state.start('StateNext');
    },

    create: function () {
        let titleDisplay = game.add.text(0, 0, gameTitle, style);
        titleDisplay.fontSize = '7vh';
        titleDisplay.anchor.set(0.5);
        titleDisplay.x = window.innerWidth / 2;
        titleDisplay.y = window.innerHeight / 8;

        let bullet = '\n\u00B7    ';
        let instructionText = '' + bullet + 'You can only attack when you have a weapon.' +
        // bullet + 'When you have a weapon you will be bright.' +
        bullet + 'Each weapon can only be used once.' + bullet + 'Weapons are stationary and gold.' + bullet + 'The strength of your attack increases with speed and vitality.';

        let instructionDisplay = game.add.text(0, 0, instructionText, style);
        instructionDisplay.fontSize = '2vh';
        instructionDisplay.anchor.set(0.5);
        instructionDisplay.x = window.innerWidth / 2;
        instructionDisplay.y = window.innerHeight / 3;

        let begin = game.add.text(0, 0, 'begin', style);
        begin.fill = '#FF7900';
        begin.fontSize = '8vh';
        begin.anchor.set(0.5);
        begin.x = window.innerWidth / 2;
        begin.y = window.innerHeight * 0.6;

        let beginBG = game.add.graphics();
        beginBG.beginFill(0x00B1F8);
        beginBG.drawRoundedRect(0, 0, begin.width * 1.2, begin.height * 1.2, Math.round(window.innerWidth / 168));
        beginBG.endFill();
        beginBG.x = begin.x - beginBG.width / 2;
        beginBG.y = begin.y - beginBG.height / 2;

        game.world.bringToTop(begin);

        beginBG.inputEnabled = true;
        beginBG.events.onInputDown.add(this.startGame);
    }
};

let StateNext = {
    create: function () {
        let levelDisplay = game.add.text(0, 0, 'level ' + level, style);
        levelDisplay.fontSize = '6vh';
        levelDisplay.anchor.set(0.5);
        levelDisplay.x = window.innerWidth / 2;
        levelDisplay.y = window.innerHeight / 2 - levelDisplay.height;
        setTimeout(_ => {
            game.state.start('StateMain');
        }, 2000);
    }
};

let StateBoss = {
    blocks: null,

    gameOver: function () {
        game.lockRender = true;
        setTimeout(_ => {
            game.lockRender = false;
            game.state.start('StateOver');
        }, 1000);
    },

    bossMovement: function (boss) {
        if (!paused) {
            let split = Math.floor(Math.random() * 3);
            if (!split) {
                let velocity = Math.floor(window.innerWidth / 4),
                    vx = game.rnd.integerInRange(-velocity, velocity),
                    vy = game.rnd.integerInRange(-velocity, velocity);

                game.add.tween(boss.body.velocity).to({ x: vx, y: vy }, 500, Phaser.Easing.Linear.None, true);
            }
        }
    },

    getGemLocation: function () {
        let x = Math.floor(Math.random() * 2) ? -3 : bossSize - gemSize + 3,
            y = game.rnd.integerInRange(3, bossSize - gemSize - 3);

        return Math.floor(Math.random() * 2) ? [x, y] : [y, x];
    },

    createGem: function (name) {
        let gemLocation = this.getGemLocation(),
            gem = game.make.graphics(gemLocation[0], gemLocation[1]);

        gem.beginFill(colorPalette[name]);
        gem.drawRect(0, 0, gemSize, gemSize);
        gem.endFill();
        gem.alpha = 0;
        gem.name = name;
        game.physics.enable(gem, Phaser.Physics.ARCADE);
        gem.body.enable = false;
        boss.addChild(gem);
    },

    stunFlash: function () {
        bossFill.clear();
        if (bossFill.strobe) {
            bossFill.beginFill(0x2C4349);
            bossFill.drawRect(0, 0, bossSize, bossSize);
            bossFill.endFill();
            bossFill.strobe = false;
        } else {
            bossFill.beginFill(0xFF2233);
            bossFill.drawRect(0, 0, bossSize, bossSize);
            bossFill.endFill();
            bossFill.strobe = true;
        }
    },

    stunBoss: function () {
        bossStunned = true;
        let strobe = game.time.events.loop(32, this.stunFlash, this, boss);
        setTimeout(_ => {
            bossStunned = false;
            game.time.events.remove(strobe);
            bossFill.strobe = true;
            this.stunFlash();
        }, 1000);
    },

    collectGem: function () {
        let fadeTime = 500;
        let gem = gemCase.children[gemsCaptured - 1];
        let gemFill = game.make.graphics(gem.x + gem.width / 2, gem.y + gem.height / 2);
        gemFill.beginFill(gem.lineColor);
        gemFill.drawRect(0, 0, gem.width, gem.height);
        gemFill.endFill();
        gemFill.scale.x = 0;
        gemFill.scale.y = 0;
        gemFill.alpha = 0;
        gemCase.add(gemFill);
        game.add.tween(gemFill).to({ x: gem.x, y: gem.y }, fadeTime, Phaser.Easing.Linear.None, true);
        game.add.tween(gemFill.scale).to({ x: 1, y: 1 }, fadeTime, Phaser.Easing.Linear.None, true);
        game.add.tween(gemFill).to({ alpha: 1 }, fadeTime, Phaser.Easing.Linear.None, true);
    },

    showGem: function () {
        let gem = boss.children[0];
        setTimeout(_ => {
            gem.body.enable = true;
            game.add.tween(gem).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        }, 500);
    },

    getGem: function (player, gem) {
        gemsCaptured++;
        gem.destroy();
        if (gemsCaptured === 4) {
            win = true;
            setTimeout(_ => {
                this.gameOver();
            }, 1000);
        }
        this.stunBoss();
        this.collectGem();
        this.showGem();
    },

    gameOver: function () {
        game.lockRender = true;
        setTimeout(_ => {
            game.lockRender = false;
            game.state.start('StateOver');
        }, 1000);
    },

    bossAttack: function () {
        if (!bossStunned) {
            this.gameOver();
        }
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();
        this.blocks = game.add.group();

        let bossTitle = game.add.text(window.innerWidth / 2, window.innerHeight / 12, 'Big Assed Boss', style);
        bossTitle.anchor.set(0.5);
        bossTitle.fontSize = '8vh';

        let gemText = game.add.text(window.innerWidth / 12, window.innerHeight / 10, 'Gems', style);
        gemCase = game.add.group();
        gemCase.x = gemText.x;
        gemCase.y = gemText.y;

        gemDisplaySize = window.innerWidth / 64;
        let gemX = Math.floor(gemDisplaySize * 1.6),
            gemY = gemText.height;

        gemDisplayRed = game.make.graphics(0, gemY);
        gemDisplayRed.lineStyle(2, colorPalette.gemRed);
        gemDisplayRed.drawRect(0, 0, gemDisplaySize, gemDisplaySize);
        gemCase.add(gemDisplayRed);

        gemDisplayGreen = game.make.graphics(gemX, gemY);
        gemDisplayGreen.lineStyle(2, colorPalette.gemGreen);
        gemDisplayGreen.drawRect(0, 0, gemDisplaySize, gemDisplaySize);
        gemCase.add(gemDisplayGreen);

        gemDisplayBlue = game.make.graphics(gemX * 2, gemY);
        gemDisplayBlue.lineStyle(2, colorPalette.gemBlue);
        gemDisplayBlue.drawRect(0, 0, gemDisplaySize, gemDisplaySize);
        gemCase.add(gemDisplayBlue);

        gemDisplayYellow = game.make.graphics(gemX * 3, gemY);
        gemDisplayYellow.lineStyle(2, colorPalette.gemYellow);
        gemDisplayYellow.drawRect(0, 0, gemDisplaySize, gemDisplaySize);
        gemCase.add(gemDisplayYellow);

        player = game.add.graphics(200, 200);
        player.beginFill(playerColor);
        player.drawRect(0, 0, playerSize, playerSize);
        player.endFill();
        player.name = 'player';
        player.vitality = 100;

        let size = Math.round(window.innerWidth / 72),
            rowLength = Math.floor(window.innerWidth / size),
            columnLength = Math.floor(window.innerHeight / size),
            row = new Array(rowLength).fill(0),
            matrix = new Array(columnLength).fill(row);

        matrix.forEach((r, cidx) => r.forEach((c, ridx) => {
            if (ridx === 0 || cidx === 0 || ridx === rowLength - 1 || cidx === columnLength - 1) {
                let block = game.make.graphics(size * ridx, size * cidx);
                block.lineStyle(2);
                block.beginFill(levelColor[1]);
                block.drawRect(0, 0, size, size);
                block.endFill();
                game.physics.enable([block], Phaser.Physics.ARCADE);
                block.body.immovable = true;
                this.blocks.add(block);
            }
        }));

        bossSize = Math.floor(window.innerWidth / 5);
        let bossGroup = game.add.group(),
            xx = window.innerWidth / 2 - bossSize / 2,
            yy = window.innerHeight / 2 - bossSize / 2;

        boss = game.add.graphics(xx, yy);
        boss.drawRect(0, 0, bossSize, bossSize);

        gemSize = Math.floor(bossSize / 6);

        this.createGem('gemRed');
        this.createGem('gemGreen');
        this.createGem('gemBlue');
        this.createGem('gemYellow');

        this.showGem();

        bossFill = game.make.graphics();
        bossFill.beginFill(0x2C4349);
        bossFill.drawRect(0, 0, bossSize, bossSize);
        bossFill.endFill();
        boss.addChild(bossFill);
        game.world.bringToTop(bossTitle);
        game.world.bringToTop(gemText);
        game.world.bringToTop(gemCase);

        game.physics.enable([player, boss], Phaser.Physics.ARCADE);
        boss.body.bounce.set(0.5);

        // game.time.events.loop(512, this.bossMovement, this, boss);
    },

    playerControl: function () {
        let x = player.body.velocity.x,
            y = player.body.velocity.y,
            velocitySquare = x * x + y * y,
            angle;

        if (velocitySquare > Math.pow(maxVelocity, 2)) {
            angle = Math.atan2(y, x);
            x = Math.cos(angle) * maxVelocity;
            y = Math.sin(angle) * maxVelocity;
            player.body.velocity.x = x;
            player.body.velocity.y = y;
        }

        if (cursors.left.isDown) {
            player.body.velocity.x -= playerAcceleration;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x += playerAcceleration;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y -= playerAcceleration;
        }
        if (cursors.down.isDown) {
            player.body.velocity.y += playerAcceleration;
        }
    },

    update: function () {
        game.physics.arcade.collide(player, boss, this.bossAttack, null, this);
        game.physics.arcade.collide(player, this.blocks);
        game.physics.arcade.collide(boss, this.blocks);
        boss.children.map((child, index, array) => {
            if (index !== array.length - 1) {
                game.physics.arcade.collide(player, child, this.getGem, null, this);
            }
        });

        this.playerControl();
    }
};

let StateOver = {
    replay: function () {
        resetGame();
        game.state.start('StateMain');
    },

    returnToMainMenu: function () {
        resetGame();
        game.state.start('StateTitle');
    },

    create: function () {
        let xx = window.innerWidth / 2;
        let yy = Math.floor(window.innerHeight / 2 * 0.9);

        let endText = win ? 'dungeon mastered!' : 'better lunch next slime';

        let endMessage = game.add.text(0, 0, endText, style);
        endMessage.fontSize = '8vh';
        endMessage.x = xx - endMessage.width / 2;
        endMessage.y = Math.floor(yy * 0.5);

        let replayLabel = game.add.text(0, 0, 'replay', style);
        replayLabel.fontSize = '7vh';
        replayLabel.fill = '#FF7900';
        replayLabel.x = xx - replayLabel.width / 2;
        replayLabel.y = yy - replayLabel.height / 2;

        let replayButton = game.add.graphics(0, 0);
        replayButton.beginFill(0x00B1F8);
        replayButton.drawRoundedRect(0, 0, replayLabel.width * 1.2, replayLabel.height * 1.2, Math.round(window.innerWidth / 168));
        replayButton.endFill();
        replayButton.x = xx - replayButton.width / 2;
        replayButton.y = yy - replayButton.height / 2;
        replayButton.inputEnabled = true;
        replayButton.events.onInputDown.add(this.replay);

        let mainMenu = game.add.text(0, 0, 'main menu', style);
        mainMenu.fontSize = '5vh';
        mainMenu.fill = '#FF7900';
        mainMenu.x = xx - mainMenu.width / 2;
        mainMenu.y = yy * 1.3 - mainMenu.height / 2;

        let mainMenuBG = game.add.graphics();
        mainMenuBG.beginFill(0x00B1F8);
        mainMenuBG.drawRoundedRect(0, 0, mainMenu.width * 1.2, mainMenu.height * 1.2, Math.round(window.innerWidth / 168));
        mainMenuBG.endFill();
        mainMenuBG.x = xx - mainMenuBG.width / 2;
        mainMenuBG.y = yy * 1.3 - mainMenuBG.height / 2;
        mainMenuBG.inputEnabled = true;
        mainMenuBG.events.onInputDown.add(this.returnToMainMenu);

        game.world.bringToTop(replayLabel);
        game.world.bringToTop(mainMenu);
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Tungeon(size, roomCount, roomSize) {
    let roomId = 2,
        maze = new Array(size).fill(0),
        row = new Array(size).fill(0),
        rooms = [];
    maze.map((x, i) => maze[i] = Array.from(row));

    return maze;
}

class Bungeon {
    constructor(size, rooms, roomSize) {
        this.maze = new Array(size).fill([]);

        this.h = size;
        this.w = size;
        this.rooms = [];
        this.roomSize = roomSize;

        this._roomId = 2;

        let row = new Array(size).fill(0);
        this.maze.map((x, i) => this.maze[i] = Array.from(row));

        for (var i = 0; i < rooms; i++) {
            var newRoom = this._createRoom();
            if (newRoom) {
                this._appendRoom(newRoom);
                this.rooms.push(newRoom);
            }
        }

        this._connectRooms();
    }

    _connectRooms() {
        var findNearest = (room, except) => {

            var inearest = -1;
            var imin = this.h * this.w;

            for (var i = 0; i < this.rooms.length; i++) {

                if (except.indexOf(this.rooms[i]) !== -1) {
                    continue;
                }

                var dist = Math.sqrt((room.cx - this.rooms[i].cx) * (room.cx - this.rooms[i].cx) + (room.cy - this.rooms[i].cy) * (room.cy - this.rooms[i].cy));

                if (dist < imin) {
                    inearest = i;
                    imin = dist;
                }
            }

            return this.rooms[inearest];
        };

        var createLink = (roomA, roomB) => {

            var dx = roomA.cx > roomB.cx ? -1 : 1;
            var dy = roomA.cy > roomB.cy ? -1 : 1;

            for (var x = roomA.cx, y = roomA.cy;;) {
                if (this.maze[y][x] == roomB.id) {
                    break;
                }

                if (y != roomB.cy) {
                    y += dy;
                } else if (x != roomB.cx) {
                    x += dx;
                } else {
                    break;
                }

                this.maze[y][x] = 1;
            }
        };

        var except = [];
        for (var i = 0; i < this.rooms.length; i++) {
            except.push(this.rooms[i]);
            var nearest = findNearest(this.rooms[i], except);
            if (nearest) {
                createLink(this.rooms[i], nearest);
            }
        }
    }

    _createRoom() {
        var room = {
            id: this._roomId,
            h: Math.floor(Math.random() * this.roomSize / 2.0 + this.roomSize / 2.0),
            w: Math.floor(Math.random() * this.roomSize / 2.0 + this.roomSize / 2.0),
            x: 0,
            y: 0,
            cx: 0,
            cy: 0
        };

        while (this._isColliding(room)) {
            room.x += Math.floor(Math.random() * 3);
            if (room.x + room.w >= this.w) {
                room.x = 0;
                room.y++;
                if (room.y + room.h >= this.h) {
                    return null;
                }
            }
        }

        room.cx = Math.floor(room.x + room.w / 2.0);
        room.cy = Math.floor(room.y + room.h / 2.0);

        this._roomId++;
        return room;
    }

    _appendRoom(room) {
        for (var i = room.y; i < room.y + room.h; i++) {
            for (var j = room.x; j < room.x + room.w; j++) {
                this.maze[i][j] = room.id;
            }
        }
    }

    _isColliding(room) {
        for (var i = Math.max(0, room.y - 1); i < Math.min(this.h, room.y + room.h + 1); i++) {
            for (var j = Math.max(0, room.x - 1); j < Math.min(this.w, room.x + room.w + 1); j++) {
                if (this.maze[i][j] != 0) {
                    return true;
                }
            }
        }

        return false;
    }
};