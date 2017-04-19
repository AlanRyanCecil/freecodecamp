'use strict';

let recipeBook = [{dish: 'Soup', ingredients: ['water', 'salt']}, {dish: 'Sandwitch', ingredients: ['bread', 'ketchup', 'bread']},];

let Recipe = React.createClass({
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
        return (
            <div id={'accordion' + this.props.id} role="tablist" aria-multiselectable="true">
                <div className="card">
                    <div className="card-header" role="tab" id="headingOne">
                        <h5 className="mb-0">
                            <a data-toggle="collapse" data-parent={'#accordion' + this.props.id} href={'#collapseOne' + this.props.id} aria-expanded="true" aria-controls="collapseOne">
                                {this.props.dish}
                            </a>
                        </h5>
                    </div>

                    <div id={'collapseOne' + this.props.id} className="collapse" role="tabpanel" aria-labelledby="headingOne">
                        <div className="card-block">
                            <h5 className="text-center">Ingredients</h5>
                            <hr></hr>
                            {this.props.ingredients.map(function(item, index) {
                                return (
                                    <div key={index}>{item}</div>
                                );
                            })}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-info" data-toggle="modal" data-target="#add-recipe" onClick={this.editRecipe}>Edit</button>
                            <button className="btn btn-danger"onClick={this.deleteRecipe}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

let RecipeBox = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return (
            <div>
                {this.props.contents.map((recipe, index) => {
                    return (
                        <Recipe updateRecipeBox={this.props.updateRecipeBox} key={index} id={'recipe-' + index} dish={recipe.dish} ingredients={recipe.ingredients} />
                    );
                })}
            </div>
        );
    }
});

let AddRecipe = React.createClass({
    render: function () {
        return (
            <div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#add-recipe">Add Recipe</button>
                </div>
                
                <div id="add-recipe" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add a Recipe</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <span className="input-group-addon" id="basic-addon1">Recipe Name</span>
                                    <input id="recipe-name" type="text" className="form-control" aria-describedby="recipe name"></input>
                                </div>
                                <br></br>
                                <h5>Ingredients:</h5>
                                <div className="input-group">
                                    <textarea id="ingredients-list" type="text" className="form-control" placeholder="list ingredients separated by commas" aria-describedby="ingredients"></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={this.props.createRecipe} type="button" className="btn btn-success" data-dismiss="modal">Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

let Main = React.createClass({
    getInitialState: function () {
        // localStorage.clear();
        localStorage.recipes = localStorage.recipes || JSON.stringify(recipeBook);
        return {
            recipes: JSON.parse(localStorage.recipes)
        }
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
    editRecipe: function () {

    },
    deleteRecipe: function () {

    },
    render: function () {
        return (
            <section className="container">
                <h1 className="recipe-box-title text-center">Recipe Box</h1>
                <RecipeBox updateRecipeBox={this.updateRecipeBox} contents={this.state.recipes}/>
                <AddRecipe createRecipe={this.createRecipe}/>
            </section>
        );
    }
});

ReactDOM.render(<Main/>, document.getElementById('root'));


