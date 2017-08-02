'use strict';

class PhaserContainer extends React.Component {
    componentDidMount () {
        game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-container');

        game.state.add('StateTitle', StateTitle);
        game.state.add('StateMain', StateMain);
        game.state.add('StateNext', StateNext);
        game.state.add('StateBoss', StateBoss);
        game.state.add('StateOver', StateOver);
        game.state.start('StateBoss');
    }
    render () {
        return (
            <div id="phaser-container"></div>
        );
    }
}

class Main extends React.Component {
    render () {
        return (
            <section>
                <PhaserContainer/>
            </section>
        );
    }
}

ReactDOM.render(<Main/>, document.getElementById('root'));