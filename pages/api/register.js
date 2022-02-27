export default function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log(body.firstName, body.lastName, body.email, body.password)

    const domain = process.env.SHOPIFY_STORE_DOMAIN
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN


    async function ShopifyData(query) {
        const URL = `https://${domain}/api/2022-01/graphql.json`
    
        const options = {
            endpoint : URL,
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        }
    
        try {
            const data = await fetch(URL, options).then(response => {
               return response.json()
            })
    
            return data
            } catch (error) {
            throw new Error("Products not fetched")
            }
        }


        async function createCustomer(firstName, lastName, email, password) {
            const query = `
            mutation {
              customerCreate(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
                customer {
                  id
                }
              }
            }
            `
            
            const response = await ShopifyData(query)
          
            const customer = response.data.customerCreate ? response.data.customerCreate : []
          
            return customer
          }

          createCustomer(body.firstName, body.lastName, body.email, body.password)


    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.firstName || !body.lastName) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'First or last name not found' })
    }
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({ data: 'customer added' })
  }