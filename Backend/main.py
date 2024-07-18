from fastapi import FastAPI, Query
import requests
from typing import List, Optional
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware
app= FastAPI()

app.add_middleware(SessionMiddleware, secret_key="test")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"]
def get_bearer_token():
    url = 'http://20.244.56.144/test/auth'
    auth_payload = {
        "companyName": "ckMart",
        "clientID": "ebe8d310-37d7-4575-937a-418872c6dd97",
        "clientSecret": "CEYpniiJIjemjeso",
        "ownerName": "Chaithanya K",
        "ownerEmail": "cchaithanya83@gmail.com",
        "rollNo":"4SO21CB012"
    }
    response = requests.post(url, json=auth_payload)
    if response.status_code == 201:
        return response.json().get('access_token')
    else:
        raise Exception("Failed to authenticate and get token")
    

@app.get('/categories/{category_name}/products')
def fetch_all_products(category_name: str, 
    product_id: Optional[str] = None,
    n: Optional[int] = 10, 
    minPrice: Optional[int] = 10, 
    maxPrice: Optional[int] = 2000, ):
    """
    API for getting products.

    Parameters:
    - `category_name`

    Returns:
    - Json 
        {
        "productName": "",
        "price": ,
        "rating": ,
        "discount": ,
        "availability": 
        }
    """
    results = []
    token = get_bearer_token()
    print(token)


    for companyname in companies:
        url = f'http://20.244.56.144/test/companies/{companyname}/categories/{category_name}/products'
        params = {
            'top': n,
            'minPrice': minPrice,
            'maxPrice': maxPrice
        }
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        response = requests.get(url, headers=headers, params=params)
        print(response)
        
        if response.status_code == 200:
            #The data is successfully fetched from server
            products = response.json()
            print(product_id)
            if product_id:
                filtered_products = [product for product in products if product.get('productName') == product_id]
                results.extend(filtered_products)
            else:
                results.extend(products)
        else:
            #fetching failed
            print("Fetch failed")


    return {"category_name": category_name, "products": results}


