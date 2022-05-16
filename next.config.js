/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
}

module.exports = {
  env: {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESSTOKEN: process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN,
    SHOPIFY_ADMIN_ACCESSTOKEN: process.env.SHOPIFY_ADMIN_ACCESSTOKEN
  },
  images: {
    domains: ['cdn.shopify.com']
  }
}
