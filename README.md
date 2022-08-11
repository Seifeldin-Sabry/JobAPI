# How To Use Store API

### - This Project was an exercise for me to implement filtering/sorting in an API

```JavaScript
URL/api/v1/products // GET all products

//EXAMPLE PRODUCT
product = {
                "name": "high-back bench",
                "price": 39,
                "featured": true,
                "rating": 3,
                "createdAt": "2022-08-11T12:10:05.143Z",
                "company": "ikea",
    }

//USING QUERY
allowed query terms => [
    'name',
    'sort',
    'price',
    'company',
    'featured',
    'rating'
]

URL/api/v1/products?query...
```

## example usage:

```JavaScript
// for filtering by price, rating
URL/api/v1/products?price=+200 // price >= 200
URL/api/v1/products?price=-100 // price <= 100

//for filtering based on featured or not
URL/api/v1/products?featured=true // featured = true
URL/api/v1/products?featured=false // featured = false

//for filtering based on companies
URL/api/v1/products?company=ikea,marcos // company = ['ikea', 'marcos']

//for filtering based on name of products
URL/api/v1/products?name=wood // uses regex -i  to search for name

//for sorting
URL/api/v1/products?company=ikea,marcos&sort=+price,-rating //same as above with price sorted in ascending order, and if price is the same, sort by rating in descending order

/**
 * Query for sorting only accepts the same query terms.
 *
```
