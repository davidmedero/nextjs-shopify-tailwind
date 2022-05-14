import { useLayoutEffect, useEffect, useState } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"


const ProductCard = ({ product }) => {

  const { handle, title } = product.node

  const { altText, originalSrc } = product.node.images.edges[0].node

  const price = product.node.priceRange.minVariantPrice.amount

  const [currencyRates, setCurrencyRates] = useState(0)

  const [currency, setCurrency] = useState('')

    // useEffect(() => {
    //     fetch('http://api.exchangeratesapi.io/v1/latest?access_key=35ec150f1f16d6ce49fa8427128872c1&base=USD')
    //     .then(res => res.json())
    //     .then(data => setCurrencyRates(data.rates))
    // }, [])

    // const shopifyConversionFee = 1.015
  
    // const GBPcurrency = [currencyRates].map(currency => currency.GBP).join('')
  
    // const EURcurrency = [currencyRates].map(currency => currency.EUR).join('')

    const shopifyConversionFee = 1.015

    const GBPcurrency = 0.82

    const EURcurrency = 0.96

  useLayoutEffect(() => {
    setCurrency(JSON.parse(localStorage.getItem('current_currency')))
    window.addEventListener('storage', () => {
      setCurrency(JSON.parse(localStorage.getItem('current_currency')))
    })
  }, [])


  return (
    <>
    <Link href={`/${handle}`}>
      <a className="group">
        <div className="w-full bg-gray-200 overflow-hidden">
            <div className="relative group-hover:opacity-75 w-full h-full">
                <Image
                    src={originalSrc}
                    alt={altText}
                    width='600' 
                    height='860' 
                    layout="responsive" 
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                />
            </div>
        </div>
        <h3 className="mt-4 xxs:ml-2 sm:ml-0 text-lg font-medium text-gray-900">{title}</h3>
        <p className='mt-1 xxs:ml-2 sm:ml-0 text-sm text-gray-700'>
          {
            currency === 'USD' ? formatter.format(price) :
            currency === 'GBP' ? GBPFormatter.format(Math.ceil(price * GBPcurrency * shopifyConversionFee)) :
            currency === 'EUR' ? EURFormatter.format(Math.ceil(price * EURcurrency * shopifyConversionFee)) :
            null
          }
        </p>
      </a>
    </Link>
    </>
  )
}

export default ProductCard