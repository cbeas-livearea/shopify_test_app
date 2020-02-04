module.exports = function (app) 
{

	var hbs = require( 'express-handlebars');
	app.set('view engine', 'hbs');
	const hbs_config=hbs.create
	({
	extname: 'hbs',
	defaultView: 'default',
	defaultLayout: 'default',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/',
	helpers:
	{
		upper_case: function(str) {return  str.toUpperCase();},
		section: function(name, options){
									if(!this._sections) this._sections = {};
									this._sections[name] = options.fn(this);
									return null;
									}

	}

	})

	app.engine( 'hbs', hbs_config.engine);


}