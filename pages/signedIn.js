import { signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import { getSession } from "next-auth/react"


export default function signedIn({ data }) {

  const { data: session } = useSession()
  const orders = data.data.customers.edges[0].node.orders.edges ? data.data.customers.edges[0].node.orders.edges : []


  return (
    <div>
        Signed in as {session?.user.email} <br />
        <div>You can now veiw order history</div>
        {
          console.log(orders)
        }
        <button onClick={() => signOut()}>Sign Out</button>
        <Link href="/" passHref>
      <a className='cursor-pointer'>
        <button>Go shopping</button>
        </a>
      </Link>
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
          orders(first: 20) {
            edges {
              node {
                id
                createdAt
                subtotalLineItemsQuantity
                subtotalPriceSet {
                  shopMoney {
                    amount
                  }
                }
                displayFulfillmentStatus
                shippingAddress {
                  address1
                }
                billingAddress {
                  address1
                  
                }
                lineItems(first: 20) {
                  edges {
                    node {
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

    try {
        const data = await fetch(URL, options).then(response => {
           return response.json()
        })

        return {
          props: { 
            data
          }, 
        }
    } catch (error) {
        throw new Error("Products not fetched")
    }
}

