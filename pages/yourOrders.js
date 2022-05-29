import { signOut, useSession } from "next-auth/react"
import { getSession } from "next-auth/react"
import Image from 'next/image'
import { formatter } from "../utils/helpers"
import Shopify from '@shopify/shopify-api'
import Link from 'next/link'
import { getAllProducts, getAllOrders } from "../lib/shopify"


export default function yourOrders({ orders, orderIdUrl, products }) {

  const handler = products.map(product => {
    const obj = {}
    obj[product.name] = product.value

    return {
      handle: product.node.handle,
      title: product.node.title
    }
  })

  const { data: session } = useSession()

  orders.sort((a, b) => -a.node.createdAt.localeCompare(b.node.createdAt))

  const allOrderSpecs = orders.map(order => {
    const allSpecs = {}
    allSpecs[order.name] = order.value

    return {
      id: order.node.id,
      dateCreated: order.node.createdAt,
      dateDelivered: order.node.fulfillments[0]?.deliveredAt,
      trackingUrl: order.node.fulfillments[0]?.trackingInfo[0]?.url,
      totalPrice: order.node.subtotalPriceSet.shopMoney.amount,
      quantity: order.node.subtotalLineItemsQuantity,
      items: order.node.lineItems.edges
    }
  })


  return (
    <div className="flex flex-col w-[1000px] max-w-full mx-auto xxs:px-6 xs:!px-8">
        <div className="mb-[100px] mt-[50px] mx-auto flex flex-wrap xxs:flex-col md:!flex-row justify-center items-center">
          <span>Signed in as<span className="font-semibold">
          { ' ' + ' ' }{session?.user.email}</span></span>
          <button onClick={() => signOut()} className="xxs:mt-6 md:!mt-0 md:ml-24 border rounded-md p-2 w-28">Sign Out</button>
          </div>
        <div className="text-3xl font-bold mb-20">Your Orders</div>

        {
          orders.length != 0 ? 
          (
            <div>
              {allOrderSpecs.map(order => {

              const orderStatusUrl = JSON.parse(orderIdUrl).body.orders.map(el => {
                if (el.id == order.id.slice(20, order.id.length)) {
                  return el.order_status_url
                }
              }).filter(el => el !== undefined)

      
              return (
              <div key={order.id + Math.random()} className="mb-[100px] relative -top-4 border-1 shadow-lg rounded-2xl p-6">
                <div className="border-b">
                  <div className="flex flex-wrap xs:!flex-row justify-between mb-5 xxs:flex-col">
                    <div className="xs:mr-4"><span className="font-semibold text-xl">Order # </span>&nbsp;
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
                ( order.trackingUrl ? <a href={order.trackingUrl}><button className="xxs:mt-4 xxs:flex xxs:justify-center xxs:w-full xs:!w-[150px] xs:!flex-none xs:!mt-0 self-start border rounded-md p-2">Track package</button></a> : <div className="xxs:flex xxs:items-center xxs:w-full xs:!w-[100px] sm:!w-[178px] xxs:mt-3 xs:!mt-0 text-green-600">Tracking # coming soon!</div> )
                }
                
                </div>

                <div className="xxs:flex-col xs:!flex-none">

                <a href={orderStatusUrl}>
                <button className="xxs:float-left xxs:flex xxs:justify-center xxs:w-full xxs:mb-[18px] xs:!float-right xs:!flex-none xs:!w-32 xs:!mb-0 border rounded-md p-2">See invoice</button>
                </a>
  
                <div className="xxs:mb-2 xs:!mb-1"><span className="font-semibold">Date placed </span>
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
                  <Link href={`/${handler.map(product => {
                    if (product.title == item.node.title){
                      return product.handle
                    }
                  }).filter(el => el !== undefined).join(' ')}`}>
                    <a>
                    <li key={i + Math.random()} className="flex pt-6 flex-wrap sm:flex-nowrap">
                    <div className="flex-shrink-0 xxs:w-full xxs:min-w-[200px] xxs:max-w-[385px] sm:!w-[250px] xxs:h-auto sm:!h-[250px] mr-6 border border-gray-200 rounded-md overflow-hidden">
                    <Image src={item.node.image.originalSrc} atl={item.node.variantTitle} width='500' height='500' layout="responsive" objectFit="cover" />
                    </div>
                      <div className="w-[628px]">
                        <div className="flex justify-between flex-col md:flex-row">
                        <div className="float-left font-semibold text-lg mr-8 mt-3 sm:mt-0">{item.node.title}</div>
                          <div>
                            <button className="xxs:flex xxs:justify-center xxs:w-full xs:!w-36 xs:!flex-none mt-2.5 sm:mt-5 md:mt-0 border rounded-md p-2 whitespace-nowrap">View Product</button>
                          </div>
                          </div>
                              <div className="pt-3 sm:pt-6 text-gray-600">
                                <div>{item.node.variantTitle}</div>
                                <div>Quantity: {item.node.quantity}</div>
                                <div>{formatter.format(item.node.originalUnitPriceSet.shopMoney.amount)}</div>
                              </div>
                      </div>
                    </li>
                    </a>
                      </Link>
                  )
                }
              </div>
              )
            })
            }</div>
          ) :
          (<div className="pb-60 xxs:flex xxs:flex-col sm:!flex-row xxs:justify-center sm:!justify-between xxs:w-full sm:w-[500px] flex-wrap">You haven't purchased anything. 
            <Link href="/" passHref>
              <a className='cursor-pointer'>
                  <span className='xxs:flex xxs:justify-center xxs:mt-6 sm:!mt-0 text-lg font-bold border rounded-md px-4 py-3 '>
                      Go Shopping!
                  </span>
              </a>
            </Link></div>)
        }
    </div>
  )
}


export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'private, max-age=10, stale-while-revalidate=2592000'
  )

  const session = await getSession({ req })
  const email = session?.user.email

  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESSTOKEN

  const client = new Shopify.Clients.Rest(`${domain}`, `${adminAccessToken}`)

  const orders = await getAllOrders(email)

  const orderIdUrl = JSON.stringify(await client.get({
    path: 'orders',
    query: {
      "fields":"id, order_status_url",
      "status":"any"
    }
  }))

  const products = await getAllProducts()

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

    try {
        return {
          props: { 
            orders,
            orderIdUrl,
            products
          },
        }
    } catch (error) {
        throw new Error("Data not fetched")
    }
}
