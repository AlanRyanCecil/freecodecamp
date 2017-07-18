'use strict';

class PhaserContainer extends React.Component {
    componentDidMount() {
        game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-container');

        game.state.add('StateTitle', StateTitle);
        game.state.add('StateMain', StateMain);
        game.state.add('StateNext', StateNext);
        game.state.add('StateBoss', StateBoss);
        game.state.add('StateOver', StateOver);
        game.state.start('StateMain');
    }
    render() {
        return React.createElement('div', { id: 'phaser-container' });
    }
}

class Main extends React.Component {
    render() {
        return React.createElement(
            'section',
            null,
            React.createElement(PhaserContainer, null)
        );
    }
}

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));