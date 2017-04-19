'use strict';

let recipeBook = [{ dish: 'Soup', ingredients: ['water', 'salt'] }, { dish: 'Sandwitch', ingredients: ['bread', 'ketchup', 'bread'] }];

let Recipe = React.createClass({
    displayName: 'Recipe',

    editRecipe: function () {
        $('#recipe-name').val(this.props.dish);
        $('#ingredients-list').val(this.props.ingredients.join(', '));
    },
    deleteRecipe: function () {
        recipeBook.map((item, index) => {
            if (item.dish === this.props.dish) {
                recipeBook.splice(index, 1);
            }
        });
        this.props.updateRecipeBox();
    },
    render: function () {
        return React.createElement(
            'div',
            { id: 'accordion' + this.props.id, role: 'tablist', 'aria-multiselectable': 'true' },
            React.createElement(
                'div',
                { className: 'card' },
                React.createElement(
                    'div',
                    { className: 'card-header', role: 'tab', id: 'headingOne' },
                    React.createElement(
                        'h5',
                        { className: 'mb-0' },
                        React.createElement(
                            'a',
                            { 'data-toggle': 'collapse', 'data-parent': '#accordion' + this.props.id, href: '#collapseOne' + this.props.id, 'aria-expanded': 'true', 'aria-controls': 'collapseOne' },
                            this.props.dish
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'collapseOne' + this.props.id, className: 'collapse', role: 'tabpanel', 'aria-labelledby': 'headingOne' },
                    React.createElement(
                        'div',
                        { className: 'card-block' },
                        React.createElement(
                            'h5',
                            { className: 'text-center' },
                            'Ingredients'
                        ),
                        React.createElement('hr', null),
                        this.props.ingredients.map(function (item, index) {
                            return React.createElement(
                                'div',
                                { key: index },
                                item
                            );
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-footer' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-info', 'data-toggle': 'modal', 'data-target': '#add-recipe', onClick: this.editRecipe },
                            'Edit'
                        ),
                        React.createElement(
                            'button',
                            { className: 'btn btn-danger', onClick: this.deleteRecipe },
                            'Delete'
                        )
                    )
                )
            )
        );
    }
});

let RecipeBox = React.createClass({
    displayName: 'RecipeBox',

    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            this.props.contents.map((recipe, index) => {
                return React.createElement(Recipe, { updateRecipeBox: this.props.updateRecipeBox, key: index, id: 'recipe-' + index, dish: recipe.dish, ingredients: recipe.ingredients });
            })
        );
    }
});

let AddRecipe = React.createClass({
    displayName: 'AddRecipe',

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'modal-footer' },
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-info btn-lg', 'data-toggle': 'modal', 'data-target': '#add-recipe' },
                    'Add Recipe'
                )
            ),
            React.createElement(
                'div',
                { id: 'add-recipe', className: 'modal fade', role: 'dialog' },
                React.createElement(
                    'div',
                    { className: 'modal-dialog' },
                    React.createElement(
                        'div',
                        { className: 'modal-content' },
                        React.createElement(
                            'div',
                            { className: 'modal-header' },
                            React.createElement(
                                'h4',
                                { className: 'modal-title' },
                                'Add a Recipe'
                            ),
                            React.createElement(
                                'button',
                                { type: 'button', className: 'close', 'data-dismiss': 'modal' },
                                '\xD7'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'modal-body' },
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement(
                                    'span',
                                    { className: 'input-group-addon', id: 'basic-addon1' },
                                    'Recipe Name'
                                ),
                                React.createElement('input', { id: 'recipe-name', type: 'text', className: 'form-control', 'aria-describedby': 'recipe name' })
                            ),
                            React.createElement('br', null),
                            React.createElement(
                                'h5',
                                null,
                                'Ingredients:'
                            ),
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement('textarea', { id: 'ingredients-list', type: 'text', className: 'form-control', placeholder: 'list ingredients separated by commas', 'aria-describedby': 'ingredients' })
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-footer' },
                                React.createElement(
                                    'button',
                                    { onClick: this.props.createRecipe, type: 'button', className: 'btn btn-success', 'data-dismiss': 'modal' },
                                    'Done'
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});

let Main = React.createClass({
    displayName: 'Main',

    getInitialState: function () {
        // localStorage.clear();
        localStorage.recipes = localStorage.recipes || JSON.stringify(recipeBook);
        return {
            recipes: JSON.parse(localStorage.recipes)
        };
    },
    updateRecipeBox: function () {
        localStorage.recipes = JSON.stringify(recipeBook);
        this.setState({ recipes: recipeBook });
    },
    createRecipe: function () {
        let ingredientsList = $('#ingredients-list').val().split(',');
        let newRecipe = {
            dish: $('#recipe-name').val(),
            ingredients: ingredientsList
        };
        $('#ingredients-list').val('');
        $('#recipe-name').val('');
        let foundRecipe = false;
        if (newRecipe.dish) {
            recipeBook.map((element, index) => {
                if (element.dish === newRecipe.dish) {
                    element.ingredients = newRecipe.ingredients;
                    foundRecipe = true;
                }
            });
            if (!foundRecipe) recipeBook.push(newRecipe);
            this.updateRecipeBox();
        }
    },
    editRecipe: function () {},
    deleteRecipe: function () {},
    render: function () {
        return React.createElement(
            'section',
            { className: 'container' },
            React.createElement(
                'h1',
                { className: 'recipe-box-title text-center' },
                'Recipe Box'
            ),
            React.createElement(RecipeBox, { updateRecipeBox: this.updateRecipeBox, contents: this.state.recipes }),
            React.createElement(AddRecipe, { createRecipe: this.createRecipe })
        );
    }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));