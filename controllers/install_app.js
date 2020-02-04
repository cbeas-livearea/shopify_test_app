const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const path = require('path');
const url = require('url'); 


 

module.exports = function (app) 
{

	//Use sesion variables
	app.use(function(req, res, next)
	{

		if ( req.path == '/install' || req.path == '/access_token') 
				return next();		

		if(req.session.shop && req.session.accessToken)
		{
			console.log("Token From Session");
			console.log(req.session.accessToken);
			
			shop=req.session.shop;
			accessToken=req.session.accessToken;
			
			res.locals.shop=req.session.shop;
			res.locals.apiKey=process.env.SHOPIFY_API_KEY;
			next();			
		}	
		else
		{
			console.log("New Token Creation");			
			res.redirect(url.format({pathname:"/install",query: {"shop": req.query.shop}}));
		}
		
			
	});

	//Home
	app.get('/',(req, res,next) => 
	{		
		res.render('home', {layout: 'default', title: 'Home',breadcrumb: '',breadcrumb_link: ''});	
	});	

	//Redirect to installation
	app.get('/install',(req, res) => 
	{
		  const shop = req.query.shop;
		  if (shop) 
		  {
		    const state = nonce();
		    const redirectUri = process.env.FORWARDING_ADDRESS + '/access_token';
		    req.session.shop = shop;

		    const installUrl = 'https://' + shop +
		      '/admin/oauth/authorize?client_id=' + process.env.SHOPIFY_API_KEY +
		      '&scope=' + process.env.SHOPIFY_SCOPES +
		      '&state=' + state +
		      '&redirect_uri=' + redirectUri;

		    console.log("Creating Install Url: "+installUrl);
		    res.cookie('state', state);
		    
		    res.render('install_app', {layout: false,install_url: installUrl});

		  } 
		  else 
		  {
		    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
		  }


	});



	app.get('/access_token', (req, res) => {
	  const { shop, hmac, code, state } = req.query;
	  const stateCookie = cookie.parse(req.headers.cookie).state;

	  if (state !== stateCookie) {
	    return res.status(403).send('Request origin cannot be verified');
	  }

	  if (shop && hmac && code) {	    

	    const map = Object.assign({}, req.query);
		delete map['signature'];
		delete map['hmac'];
		const message = querystring.stringify(map);
		const providedHmac = Buffer.from(hmac, 'utf-8');
		const generatedHash = Buffer.from(
		  crypto
		    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
		    .update(message)
		    .digest('hex'),
		    'utf-8'
		  );
		let hashEquals = false;
		// timingSafeEqual will prevent any timing attacks. Arguments must be buffers
		try {
		  hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
		// timingSafeEqual will return an error if the input buffers are not the same length.
		} catch (e) {
		  hashEquals = false;
		};

		if (!hashEquals) {
		  return res.status(400).send('HMAC validation failed');
		}

		const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
		  client_id: process.env.SHOPIFY_API_KEY,
		  client_secret: process.env.SHOPIFY_API_SECRET,
		  code,
		};

		request.post(accessTokenRequestUrl, { json: accessTokenPayload })
		.then((accessTokenResponse) => {
		  req.session.accessToken = accessTokenResponse.access_token;
			
		  console.log("New Token: ");
		  console.log(accessTokenResponse);
		  		  
		  res.redirect("/");		  

		})
		.catch((error) => {
		  res.status(error.statusCode).send(error.error.error_description);
		});

	  } else {
	    res.status(400).send('Required parameters missing');
	  }
	});

}