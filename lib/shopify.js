const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESSTOKEN

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

async function ShopifyAdminData(query) {
  const URL = `https://${domain}/admin/api/2022-01/graphql.json`

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

      return data
  } catch (error) {
      throw new Error("Products not fetched")
  }
}

export async function getAllOrders(email, cursor = '') {
  let data;

  if (cursor !== '') {
    const query = `
  query {
    customers(first:1, query:"email:'${email}") {
      edges {
        node {
          orders(after: "${cursor}, first: 20) {
            edges {
              cursor
              node {
                id
                createdAt
                fulfillments(first: 20) {
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
                lineItems(first: 10) {
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
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    }
  }
  `

    const response = await ShopifyAdminData(query)
    data = response.data?.customers.edges[0]?.node.orders.edges ? response.data.customers.edges[0].node.orders.edges : []

    if (response.data?.customers.edges[0]?.node.orders.pageInfo.hasNextPage) {
      const num = response.data.customers.edges[0].node.orders.edges.length
      const cursor = response.data.customers.edges[0].node.orders.edges[num - 1].cursor

      return data.concat(await getAllOrders(email, cursor))
    } else {
      return data
    }
  } else {
    const query = `
  query {
    customers(first:1, query:"email:'${email}") {
      edges {
        node {
          orders(first: 20) {
            edges {
              cursor
              node {
                id
                createdAt
                fulfillments(first: 20) {
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
                lineItems(first: 10) {
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
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    }
  }
  `

    const response = await ShopifyAdminData(query)
    data = response.data?.customers.edges[0]?.node.orders.edges ? response.data.customers.edges[0].node.orders.edges : []

    if (response.data?.customers.edges[0]?.node.orders.pageInfo.hasNextPage) {
      const num = response.data.customers.edges[0].node.orders.edges.length
      const cursor = response.data.customers.edges[0].node.orders.edges[num - 1].cursor

      return data.concat(await getAllOrders(email, cursor))
    } else {
      return data
    }
  }
}

export async function getProductsInHomePage() {
  const query = `
  {
    collectionByHandle(handle: "frontpage") {
      title
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)

  const allProducts = response.data.collectionByHandle.products.edges ? response.data.collectionByHandle.products.edges : []

  return allProducts
}

export async function getProductsbyCollection(handle, cursor = '') {
  let data

  if (cursor !== '') {
  const query = `
  {
    collectionByHandle(handle: "${handle}") {
      title
      products(after: "${cursor}", first: 100) {
        edges {
          cursor
          node {
            id
            title
            handle
            tags
            vendor
            collections(first: 10) {
              edges {
                node {
                  id
                  handle
                  title
                }
              }
            }
            variants(first: 50) {
          	  edges {
                node {
                  selectedOptions {
                    name
                    value
                  }
                  id
                  title
                  availableForSale
                  image {
                    originalSrc
                    altText
                    id
                  }       
            		}
          		}
        		}
            createdAt
            priceRange {
              minVariantPrice {
                amount
              }
            }
            options {
              id
              name
              values
            }
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }`

  const response = await ShopifyData(query)

    data = response.data.collectionByHandle?.products.edges ? response.data.collectionByHandle.products.edges : []
    
    if (response.data.collectionByHandle?.products.pageInfo.hasNextPage) {
      const num = response.data.collectionByHandle.products.edges.length
      const cursor = response.data.collectionByHandle.products.edges[num - 1].cursor

      return data.concat(await getProductsbyCollection(handle, cursor))
    } else {
      return data
    }
  } else {
    const query = `{
      collectionByHandle(handle: "${handle}") {
        title
        products(first: 100) {
          edges {
            cursor
            node {
              id
              title
              handle
              tags
              vendor
              collections(first: 10) {
                edges {
                  node {
                    id
                    handle
                    title
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    selectedOptions {
                      name
                      value
                    }
                    id
                    title
                    availableForSale
                    image {
                      originalSrc
                      altText
                      id
                    }       
                  }
                }
              }
              createdAt
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              options {
                id
                name
                values
              }
              images(first: 5) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
    `

    const response = await ShopifyData(query)
    
    data = response.data.collectionByHandle?.products.edges ? response.data.collectionByHandle.products.edges : []

    if (response.data.collectionByHandle?.products.pageInfo.hasNextPage) {
      const num = response.data.collectionByHandle.products.edges.length
      const cursor = response.data.collectionByHandle.products.edges[num - 1].cursor

      return data.concat(await getProductsbyCollection(handle, cursor))
    } else {
      return data
    }
  }
}

export async function getAllProducts(cursor = '') {
  let data;

  if (cursor !== '') {
    const query = `{
      products(after: "${cursor}", first: 100) {
        edges {
          cursor
          node {
            handle
            id
            title
            tags
            createdAt
            vendor
            productType
            collections(first: 10) {
              edges {
                node {
                  id
                  handle
                  title
                }
              }
            }
            options {
              id
              name
              values
            }
            images(first: 10) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
            variants(first: 200) {
              edges {
                node {
                  selectedOptions {
                    name
                    value
                  }
                  id
                  title
                  availableForSale
                  image {
                    originalSrc
                    altText
                    id
                  }       
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`

    const response = await ShopifyData(query);
    data = response.data?.products.edges ? response.data.products.edges : []

    if (response.data?.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length
      const cursor = response.data.products.edges[num - 1].cursor

      return data.concat(await getAllProducts(cursor))
    } else {
      return data
    }
  } else {
    const query = `{
      products(first: 100) {
        edges {
          cursor
          node {
            handle
            id
            title
            tags
            createdAt
            vendor
            productType
            collections(first: 10) {
              edges {
                node {
                  id
                  handle
                  title
                }
              }
            }
            options {
              id
              name
              values
            }
            images(first: 10) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
            variants(first: 200) {
              edges {
                node {
                  selectedOptions {
                    name
                    value
                  }
                  id
                  title
                  availableForSale
                  image {
                    originalSrc
                    altText
                    id
                  }       
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
    `

    const response = await ShopifyData(query)
    data = response.data?.products.edges ? response.data.products.edges : []

    if (response.data?.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length
      const cursor = response.data.products.edges[num - 1].cursor

      return data.concat(await getAllProducts(cursor))
    } else {
      return data
    }
  }
}

export async function getProduct(handle) {
  const query = `
  {
    productByHandle(handle: "${handle}") {
    	collections(first: 100) {
      	edges {
          node {
            id
            title
            handle
            products(first: 100) {
              edges {
                node {
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  handle
                  title
                  id
                  totalInventory
                  images(first: 5) {
                    edges {
                      node {
                        originalSrc
                        altText
                      }
                    }
                  }
                  options {
                    name
                    values
                    id
                  }
                  variants(first: 100) {
                    edges {
                      node {
                        sku
                        selectedOptions {
                          name
                          value
                        }
                        image {
                          originalSrc
                          altText
                          id
                        }
                        title
                        id
                        availableForSale
                        priceV2 {
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
      id
      title
      handle
      vendor
      productType
      descriptionHtml
      metafield(namespace: "custom", key: "suggestions") {
      	value
    	}
      images(first: 5) {
        edges {
          node {
            originalSrc
            altText
            id
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 100) {
        edges {
          node {
            sku
            selectedOptions {
              name
              value
            }
            image {
              originalSrc
              altText
              id
            }
            title
            id
            availableForSale
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)

  const product = response.data.productByHandle ? response.data.productByHandle : []

  return product
}

export async function createCheckout(id, quantity, currency) {

  const query =`
      mutation @inContext(country: ${currency}) {
        checkoutCreate(input: {
          buyerIdentity: {
            countryCode: ${currency}
          }
          lineItems: [{ variantId: "${id}", quantity: ${quantity}}]
        }) {
          checkout {
            id
            webUrl
            buyerIdentity {
              countryCode
            }
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  variant {
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }`

  const response = await ShopifyData(query)

  const checkout = response.data?.checkoutCreate.checkout ? response.data.checkoutCreate.checkout : []

  return checkout
}

export async function updateCheckout(id, lineItems) {
  const lineItemsObject = lineItems.map(item => {
    return `{
      variantId: "${item.id}",
      quantity:  ${item.variantQuantity}
    }`
  })

  const query = `
  mutation {
    checkoutLineItemsReplace(lineItems: [${lineItemsObject}], checkoutId: "${id}") {
      checkout {
        id
        webUrl
        lineItems(first: 25) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)

  const checkout = response?.data?.checkoutLineItemsReplace?.checkout ? response?.data?.checkoutLineItemsReplace?.checkout : []

  return checkout
}

export async function getAllCollections() {
  const query = 
  `{
    collections(first: 200) {
      edges {
        node {
          handle
          title
          id
          products(first: 25) {
            edges {
              node {
                handle
                title
                id
              }
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)

  const slugs = response.data.collections.edges ? response.data.collections.edges : []

  return slugs
}

export async function recursiveCatalog(cursor = '', initialRequest = true) {
  let data;

  if (cursor !== '') {
    const query = `{
      products(after: "${cursor}", first: 250) {
        edges {
          cursor
          node {
            handle
            id
            title
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`

    const response = await ShopifyData(query)
    data = response.data.products.edges ? response.data.products.edges : []

    if (response.data.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length
      const cursor = response.data.products.edges[num - 1].cursor

      return data.concat(await recursiveCatalog(cursor));
    } else {
      return data
    }
  } else {
    const query = `{
      products(first: 250) {
        edges {
          cursor
          node {
            handle
            id
            title
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
    `

    const response = await ShopifyData(query)
    data = response.data.products.edges ? response.data.products.edges : []

    if (response.data.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length
      const cursor = response.data.products.edges[num - 1].cursor

      return data.concat(await recursiveCatalog(cursor))
    } else {
      return data
    }
  }
}