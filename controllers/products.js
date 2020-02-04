const request = require('request-promise');

module.exports = function (app) 
{

	app.get('/products',(req, res,next) => 
	{

		const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/products.json';
		const shopRequestHeaders = {'X-Shopify-Access-Token': accessToken,};

		request.get(shopRequestUrl, { headers: shopRequestHeaders })
		.then((shopResponse) => {
		  //res.end(shopResponse);
		  res.render('products', {title: 'Products',breadcrumb: '',breadcrumb_link: '',products:JSON.parse(shopResponse)});
		})
		.catch((error) => {
		  res.status(error.statusCode).send(error.error.error_description);
		});
	});	


	app.get('/edit_product/:id',(req, res,next) => 
	{
	
		id=req.params.id;
		const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/products/'+id+'.json';
		const shopRequestHeaders = {'X-Shopify-Access-Token': accessToken,};

		
		request.get(shopRequestUrl, { headers: shopRequestHeaders})
		.then((shopResponse) => {
		  //res.end(shopResponse);
		  product=JSON.parse(shopResponse);
		  res.render('edit_product', {title: 'Edit Product',heading:"Edit Product",breadcrumb: 'Products',breadcrumb_link: '/products',product:product.product});
		})
		.catch((error) => {
		  res.status(error.statusCode).send(error.error.error_description);
		});

	});

	app.post('/update_product/:id', (req, res, next) =>
	{

	
		body= {"product": 
		{"id": req.params.id,
	    "title": req.body.title}
		};

		
		
		const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/products/'+req.params.id+'.json';
		const shopRequestHeaders = {'X-Shopify-Access-Token': accessToken,"Content-Type": "application/json"};

		var options = {
		    method: 'PUT',
		    url: shopRequestUrl,
		    body: JSON.stringify(body),
		    headers:shopRequestHeaders,    
		};

		request(options)
		.then((shopResponse) => {
		  res.end(shopResponse);	  
		})
		.catch((error) => {
			console.log(error);
			res.status(error.statusCode).send(error.error.error_description);
		});

	});


}
