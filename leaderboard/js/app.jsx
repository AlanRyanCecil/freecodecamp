'use strict';

let Heading = React.createClass({
    render: function () {
        return <h1 className="heading">{this.props.text}</h1>;
    }
});

let Leaders = React.createClass({
    getInitialState: function () {
        return {
            content: []
        }
    },
    componentDidMount: function () {
        $.get({
            url: 'https://fcctop100.herokuapp.com/api/fccusers/top/recent'
        }).then(data => {
            this.setState({content: data});
            console.log(data);
        });
    },
    image: function (img) {
        return <img className="user-image" src={img}/>;
    },
    anchor: function (user) {
        return <a href={'https://www.freecodecamp.com/' + user} target="_blank">{user}</a>;
    },
    render: function () {
        return (
            <div className="container">
                <BootstrapTable data={this.state.content} striped={true} hover={true}>
                    <TableHeaderColumn dataField="img" dataFormat={this.image} dataAlign="center" dataSort={false}>Profile Picture</TableHeaderColumn>
                    <TableHeaderColumn dataField="username" dataFormat={this.anchor} isKey={true} dataAlign="left" dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="recent" dataAlign="center" dataSort={true}>Past 30 Days</TableHeaderColumn>
                    <TableHeaderColumn dataField="alltime" dataAlign="center" dataSort={true}>All Time</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
});

let Main = React.createClass({
    render: function () {
        return (
            <section>
                <Heading text="freeCodeCamp Leaderboard"/>
                <Leaders/>
            </section>
        );
    }
});

ReactDOM.render(<Main />, document.getElementById('root'));
