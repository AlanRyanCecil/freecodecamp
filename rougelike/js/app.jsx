'use strict';

let game,
    playerShape,
    player,
    cursors,
    walls,
    floorShape,
    floor;

let Title = React.createClass({
    getInitialState: function () {
        return {
            message: 'blunk'
        }
    },
    componentDidMount: function () {
        console.log('fart');
    },
    render: function () {
        return (
            <h1 className="red">{this.state.message}</h1>
        );
    }
});

let PhaserContainer = React.createClass({
    getInitialState: function () {
        return {
            game: null
        }
    },

    preload: function () {
        game.load.image('logo', 'phaser.png');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();

        game.Tilemap.create('earth', 5, 5, 100, 100);

        playerShape = game.add.graphics(0, 0);
        playerShape.beginFill(0xFF3300);
        playerShape.drawRect(400, 200, 20, 20);
        playerShape.endFill();

        player = game.add.sprite(0, 0);
        player.addChild(playerShape);

        game.physics.arcade.enable(player);
        game.physics.arcade.enableBody(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;

        floorShape = game.add.graphics(0, 0);
        floorShape.beginFill(0x22FF55);
        floorShape.drawRect(0, 600, 600, 60);
        floorShape.endFill();

        floor = game.add.sprite(0, 0);
        // floor.enableBody = true;
        game.physics.arcade.enableBody(floor);
        floor.addChild(floorShape);
        // floor.body.immovable = true;

    },

    update: function () {
        game.physics.arcade.collide(floor, player);
    },

    componentDidMount: function () {
        game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'phaser-container', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    },

    render: function () {
        return (
            <div id="phaser-container"></div>
        );
    }
})

let Main = React.createClass({
    render: function () {
        return (
            <section className="container">
                <Title/>
                <PhaserContainer/>
            </section>
        );
    }
});

ReactDOM.render(<Main/>, document.getElementById('root'));