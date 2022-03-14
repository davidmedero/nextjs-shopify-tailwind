import { signOut, useSession } from "next-auth/react"
import { getSession } from "next-auth/react"
import Image from 'next/image'
import { formatter } from "../utils/helpers"
import Shopify from '@shopify/shopify-api'
import Link from 'next/link'
import { getAllProducts, getProduct } from "../lib/shopify"


export default function signedIn({ data, data2, product }) {
  const products = product.collections.edges[0].node.products.edges.map(el => el.node)
  
  const handler = products.map(product => {
    const obj = {}
    obj[product.name] = product.value

    return {
      handle: product.handle,
      title: product.title
    }
  })

  const { data: session } = useSession()
  const orders = data.data.customers.edges[0].node.orders.edges ? data.data.customers.edges[0].node.orders.edges : []

  const allOrderSpecs = orders.map(order => {
    const allSpecs = {}
    allSpecs[order.name] = order.value

    return {
      id: order.node.id,
      dateCreated: order.node.createdAt,
      dateDelivered: order.node.fulfillments[0].deliveredAt,
      trackingUrl: order.node.fulfillments[0].trackingInfo[0].url,
      totalPrice: order.node.subtotalPriceSet.shopMoney.amount,
      quantity: order.node.subtotalLineItemsQuantity,
      items: order.node.lineItems.edges
    }
  })


  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto pl-8 pr-8">
        <div className="mb-[100px] mt-[50px] mx-auto">
          Signed in as
          { ' ' + ' ' }
          <span className="font-semibold">{session?.user.email}</span>
          </div>
        <div className="text-3xl font-bold mb-20">Your Orders</div>

          <div>{allOrderSpecs.map(order => {

            const orderStatusUrl = JSON.parse(data2).body.orders.map(el => {
              if (el.id == order.id.slice(20, order.id.length)) {
                return el.order_status_url
              }
            }).filter(el => el !== undefined)

          
            return (
            <div key={order.id + Math.random()} className="mb-[100px] border rounded-md p-6">
              <div className="border-b pb-1">
              <div className="flex flex-wrap xs:!flex-row justify-between mb-5 xxs:flex-col">
              <div><span className="font-semibold text-xl">Order # </span>&nbsp;
              <span className="text-gray-600">{order.id.slice(20, order.id.length)}</span>

              </div>
              
              {
              order.dateDelivered != null ? 
              <div className="self-start xs:mt-3">Delivered on 
                { ' ' }
                {new Date(order.dateDelivered.slice(5, order.dateDelivered.length - 13)).toLocaleString('default', { month: 'short' })
                 + ' ' + 
                ( Number(order.dateDelivered.slice(8, order.dateDelivered.length - 10)) < 10 ? order.dateDelivered.slice(9, order.dateDelivered.length - 10) : order.dateDelivered.slice(8, order.dateDelivered.length - 10)) 
                + ', ' + 
                order.dateDelivered.slice(0, order.dateDelivered.length - 16)}
                </div> 
                : 
              <button className="xxs:mt-3 xxs:flex xxs:justify-center xxs:w-full xs:!w-[150px] xs:!flex-none xs:!mt-0 self-start border rounded-md p-2"><a href={order.trackingUrl}>Track package</a></button>
              }
              
              </div>
              <div className="xxs:flex-col xs:!flex-none">
              <button className="xxs:float-left xxs:flex xxs:justify-center xxs:w-full xxs:mb-3 xs:!float-right xs:!flex-none xs:!w-32 xs:!mb-0 border rounded-md p-2"><a href={orderStatusUrl}>See invoice</a></button>

              <div className="mb-1"><span className="font-semibold">Date placed </span>
              <span className="text-gray-600">{ ' ' }&nbsp;
                {new Date(order.dateCreated.slice(5, order.dateCreated.length - 13)).toLocaleString('default', { month: 'short' }) 
              + ' ' + 
              ( Number(order.dateCreated.slice(8, order.dateCreated.length - 10)) < 10 ? order.dateCreated.slice(9, order.dateCreated.length - 10) : order.dateCreated.slice(8, order.dateCreated.length - 10)) 
              + ', ' + 
              order.dateCreated.slice(0, order.dateCreated.length - 16)}</span></div>

              <div className="mb-5"><span className="font-semibold">Total amount </span>&nbsp;
              <span className="text-gray-600">{formatter.format(order.totalPrice)}</span>
              </div>
              </div>
              </div>
              {
                order.items.map((item, i) => 
                  <li key={i + Math.random()} className="flex pt-6 flex-wrap sm:flex-nowrap">
                  <div className="flex-shrink-0 xxs:w-full xxs:min-w-[200px] xxs:max-w-[350px] sm:!w-[250px] xxs:h-auto sm:!h-[250px] mr-6 border border-gray-200 rounded-md overflow-hidden">
                  <Image src={item.node.image.originalSrc} atl={item.node.variantTitle} width='500' height='500' layout="responsive" objectFit="cover" />
                  </div>
                    <div className="w-[628px]">
                      <div className="flex justify-between flex-col md:flex-row">
                      <div className="float-left font-semibold text-lg mr-8 mt-3 sm:mt-0">{item.node.title}</div>
                        <div>
                        <Link href={`/products/${handler.map(product => {
                              if (product.title == item.node.title){
                                return product.handle
                              }
                            }).filter(el => el !== undefined).join(' ')}`}>
                          <a className="group">
                          <button className="xxs:flex xxs:justify-center xxs:w-full xs:!w-36 xs:!flex-none mt-2.5 sm:mt-5 md:mt-0 border rounded-md p-2 whitespace-nowrap">View Product</button>
                          </a>
                          </Link>
                        </div>
                        </div>
                            <div className="pt-3 sm:pt-6 text-gray-600">
                              <div>{item.node.variantTitle}</div>
                              <div>Quantity: {item.node.quantity}</div>
                              <div>{formatter.format(item.node.originalUnitPriceSet.shopMoney.amount)}</div>
                            </div>
                    </div>
                  </li>
                )
              }
              </div>
            )
          })}</div>

        <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}


export async function getServerSideProps({ req }) {

  const session = await getSession({ req })
  const email = session?.user.email

  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESSTOKEN

  const URL = `https://${domain}/admin/api/2022-01/graphql.json`

  const query = `
  query {
    customers(first:1, query:"email:'${email}") {
      edges {
        node {
          orders(first: 5) {
            edges {
              node {
                id
                createdAt
                fulfillments(first: 5) {
                  deliveredAt
                  trackingInfo {
                    url
                  }
                }
                subtotalLineItemsQuantity
                subtotalPriceSet {
                  shopMoney {
                    amount
                  }
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      image {
                        originalSrc
                      }
                      title
                      variantTitle
                      quantity
                      originalUnitPriceSet {
                        shopMoney {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `

    const options = {
        endpoint : URL,
        method: "POST",
        headers: {
            "X-Shopify-Access-Token": adminAccessToken,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    }

    const client = new Shopify.Clients.Rest(`${domain}`, `${adminAccessToken}`)

    try {
        const data = await fetch(URL, options).then(response => {
           return response.json()
        })

        const data2 = JSON.stringify(await client.get({
          path: 'orders',
          query: {
            "fields":"id, order_status_url",
            "status":"any"
          }
        }))

        const products = await getAllProducts()

        const paths = products.map(item => {
        const product = String(item.node.handle)

            return {
                params: { product }
            }
        })

        const handles = paths.map(item => item.params.product)

        const product = await getProduct(...handles)

        return {
          props: { 
            data,
            data2,
            product,
            fallback: false
          }, 
        }
    } catch (error) {
        throw new Error("Products not fetched")
    }
}
