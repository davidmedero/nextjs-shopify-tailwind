import { useLayoutEffect, useEffect, useState, useRef } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"


const ProductCard = ({ product, currentCurrency }) => {

  const { handle, title } = product.node

  const { altText, originalSrc } = product.node.images.edges[0].node

  const price = product.node.priceRange.minVariantPrice.amount

  const [currencyRates, setCurrencyRates] = useState(0)

  useEffect(() => {
      fetch('http://api.exchangeratesapi.io/v1/latest?access_key=35ec150f1f16d6ce49fa8427128872c1&base=USD')
      .then(res => res.json())
      .then(data => setCurrencyRates(data.rates))
  }, [])

  const GBPcurrency = [currencyRates].map(currency => currency.GBP).join('')

  const EURcurrency = [currencyRates].map(currency => currency.EUR).join('')

  console.log(currentCurrency === undefined)

  return (
    <>
    <Link href={`/${handle}`}>
      <a className="group">
        <div className="w-full bg-gray-200 rounded-3xl overflow-hidden">
            <div className="relative group-hover:opacity-75 w-full h-full">
                <Image
                    src={originalSrc}
                    alt={altText}
                    width='500' 
                    height='500' 
                    layout="responsive" 
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                />
            </div>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className='mt-1 text-sm text-gray-700'>
          {
          (currentCurrency == 'GBP') ? formatter.format(price) : null
          }
        </p>
      </a>
    </Link>
    </>
  )
}

export default ProductCard