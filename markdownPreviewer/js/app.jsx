'use strict';

const heading = 'Markdown Previewer';

let markdown = 'Heading\n==\n\n' +
            'Sub-heading\n--\n\n' +
            '### Sub-sub-heading\n\n' +
            '#### Sub-sub-sub-heading\n\n' +
            '*italic*, **bold**, `monospace`, ~~strikethrough~~\n\n' +
            'Numbered list:\n\n1. first\n2. second\n3. third\n\n' +
            'unordered list:\n\n  * apples\n  * oranges\n  * stairs';

let Input = React.createClass({
    render: function () {
        return (
            <textarea type="text" className="col-md-6" rows="40" placeholder={markdown} onChange={this.props.change}/>
        );
    }
});

let Output = React.createClass({
    render: function () {
        return (
            <div className="col-md-6" dangerouslySetInnerHTML={{__html: marked(this.props.markdown)}}></div>
        );
    }
});

let Main = React.createClass({
    getInitialState: function () {
        return {
            markdown: markdown
        }
    },
    render: function () {
        return (
            <section>
                <div className="navbar">
                    <h1>{heading}</h1>
                </div>
                <div className="row">
                    <Input change={this.updateHTML}/>
                    <Output markdown={this.state.markdown}/>
                </div>
            </section>
        );
    },
    updateHTML: function (event) {
        let newMarkdown = event.target.value ? event.target.value : markdown;
        this.setState({
            markdown: newMarkdown
        });
    }
})

ReactDOM.render(<Main />, document.getElementById('root'));