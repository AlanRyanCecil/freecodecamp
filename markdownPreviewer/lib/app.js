'use strict';

const heading = 'Markdown Previewer';

let markdown = 'Heading\n==\n\n' + 'Sub-heading\n--\n\n' + '### Sub-sub-heading\n\n' + '#### Sub-sub-sub-heading\n\n' + '*italic*, **bold**, `monospace`, ~~strikethrough~~\n\n' + 'Numbered list:\n\n1. first\n2. second\n3. third\n\n' + 'unordered list:\n\n  * apples\n  * oranges\n  * stairs';

let Input = React.createClass({
    displayName: 'Input',

    render: function () {
        return React.createElement('textarea', { type: 'text', className: 'col-md-6', rows: '40', placeholder: markdown, onChange: this.props.change });
    }
});

let Output = React.createClass({
    displayName: 'Output',

    render: function () {
        return React.createElement('div', { className: 'col-md-6', dangerouslySetInnerHTML: { __html: marked(this.props.markdown) } });
    }
});

let Main = React.createClass({
    displayName: 'Main',

    getInitialState: function () {
        return {
            markdown: markdown
        };
    },
    render: function () {
        return React.createElement(
            'section',
            null,
            React.createElement(
                'div',
                { className: 'navbar' },
                React.createElement(
                    'h1',
                    null,
                    heading
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(Input, { change: this.updateHTML }),
                React.createElement(Output, { markdown: this.state.markdown })
            )
        );
    },
    updateHTML: function (event) {
        let newMarkdown = event.target.value ? event.target.value : markdown;
        this.setState({
            markdown: newMarkdown
        });
    }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));