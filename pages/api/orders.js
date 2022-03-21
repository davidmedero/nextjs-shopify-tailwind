// import { getSession } from "next-auth/react"
// import Shopify from '@shopify/shopify-api'
// import { getAllProducts, getProduct } from "../../lib/shopify"


// export default async function orders({ req }) {
    
//     const session = await getSession({ req })
//     const email = session?.user.email
  
//     const domain = process.env.SHOPIFY_STORE_DOMAIN
//     const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESSTOKEN
  

//     const URL = `https://${domain}/admin/api/2022-01/graphql.json`

//     const query = `
//     query {
//     customers(first:1, query:"email:'${email}") {
//         edges {
//         node {
//             orders(first: 5) {
//             edges {
//                 node {
//                 id
//                 createdAt
//                 fulfillments(first: 5) {
//                     deliveredAt
//                     trackingInfo {
//                     url
//                     }
//                 }
//                 subtotalLineItemsQuantity
//                 subtotalPriceSet {
//                     shopMoney {
//                     amount
//                     }
//                 }
//                 lineItems(first: 5) {
//                     edges {
//                     node {
//                         image {
//                         originalSrc
//                         }
//                         title
//                         variantTitle
//                         quantity
//                         originalUnitPriceSet {
//                         shopMoney {
//                             amount
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//     }
//     `

//     const options = {
//         endpoint : URL,
//         method: "POST",
//         headers: {
//             "X-Shopify-Access-Token": adminAccessToken,
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ query })
//     }

//     const client = new Shopify.Clients.Rest(`${domain}`, `${adminAccessToken}`)
  
//       try {
//           const data = await fetch(URL, options).then(response => {
//              return response.json()
//           })

//           const data2 = JSON.stringify(await client.get({
//             path: 'orders',
//             query: {
//               "fields":"id, order_status_url",
//               "status":"any"
//             }
//           }))
  
//           const products = await getAllProducts()
  
//           const paths = products.map(item => {
//           const product = String(item.node.handle)
  
//               return {
//                   params: { product }
//               }
//           })
  
//           const handles = paths.map(item => item.params.product)
  
//           const product = await getProduct(...handles)
  
//           return [data, data2, product]

//           } catch (error) {
//           throw new Error("Products not fetched")
//           }
  
// }
  