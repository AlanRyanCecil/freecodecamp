'use strict';

let Heading = React.createClass({
    displayName: 'Heading',

    render: function () {
        return React.createElement(
            'h1',
            { className: 'heading' },
            this.props.text
        );
    }
});

let Leaders = React.createClass({
    displayName: 'Leaders',

    getInitialState: function () {
        return {
            content: []
        };
    },
    componentDidMount: function () {
        $.get({
            url: 'https://fcctop100.herokuapp.com/api/fccusers/top/recent'
        }).then(data => {
            this.setState({ content: data });
            console.log(data);
        });
    },
    image: function (img) {
        return React.createElement('img', { className: 'user-image', src: img });
    },
    anchor: function (user) {
        return React.createElement(
            'a',
            { href: 'https://www.freecodecamp.com/' + user, target: '_blank' },
            user
        );
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'container' },
            React.createElement(
                BootstrapTable,
                { data: this.state.content, striped: true, hover: true },
                React.createElement(
                    TableHeaderColumn,
                    { dataField: 'img', dataFormat: this.image, dataAlign: 'center', dataSort: false },
                    'Profile Picture'
                ),
                React.createElement(
                    TableHeaderColumn,
                    { dataField: 'username', dataFormat: this.anchor, isKey: true, dataAlign: 'left', dataSort: true },
                    'Name'
                ),
                React.createElement(
                    TableHeaderColumn,
                    { dataField: 'recent', dataAlign: 'center', dataSort: true },
                    'Past 30 Days'
                ),
                React.createElement(
                    TableHeaderColumn,
                    { dataField: 'alltime', dataAlign: 'center', dataSort: true },
                    'All Time'
                )
            )
        );
    }
});

let Main = React.createClass({
    displayName: 'Main',

    render: function () {
        return React.createElement(
            'section',
            null,
            React.createElement(Heading, { text: 'freeCodeCamp Leaderboard' }),
            React.createElement(Leaders, null)
        );
    }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));