const request = require('request-promise');



module.exports = function (app) 
{
	app.get('/shop',

	//Check if app is already installed	
	(req, res,next) => 
	{		
	
		const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
		const shopRequestHeaders = {'X-Shopify-Access-Token': accessToken,};

		request.get(shopRequestUrl, { headers: shopRequestHeaders })
		.then((shopResponse) => {
		  //res.end(shopResponse);
		  res.render('shop', {title: 'Shop',breadcrumb: '',breadcrumb_link: '',shop:JSON.parse(shopResponse)});
		})
		.catch((error) => {
		  res.status(error.statusCode).send(error.error.error_description);
		});

	});

};
