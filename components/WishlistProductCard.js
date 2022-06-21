import { useLayoutEffect, useEffect, useState, useCallback } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"
import { useRouter } from 'next/router'


const WishlistProductCard = ({ product }) => {

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const { handle, title } = product.node

  const { altText, originalSrc } = product.node.images.edges[0].node

  const secondPicSrc = product.node.images.edges[1].node.originalSrc

  const secondPicAltText = product.node.images.edges[1].node.altText

  const [show2ndPic, setShow2ndPic] = useState(false)

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

  const [heartFill, setHeartFill] = useState(true)

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const updateMacros = async () => {
    const res = await fetch("http://localhost:3000/api/wishlist-endpoint", {
      method: 'delete',
      body: JSON.stringify(handle)
    })
  
    if (res.status < 300) {
        refreshData();
      }
  }


  return (
    <>
    <Link href={`/${handle}`}>
      <a className="group">
        <div className="w-full bg-gray-200 overflow-hidden">
            <div className="xxs:hidden lg:block relative w-full h-full">
            <span 
              onMouseOver={() => setHeartFill(false)}
              onMouseLeave={() => setHeartFill(true)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros();
              }}
              className="absolute right-[6px] top-1 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              {
                show2ndPic ? (
                  <Image
                    src={secondPicSrc}
                    alt={secondPicAltText}
                    width='600'
                    height='860'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseLeave={() => setShow2ndPic(false)}
                />
                )
                :
                (<Image
                    src={originalSrc}
                    alt={altText}
                    width='600'
                    height='860'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => setShow2ndPic(true)}
                />)
              }
            </div>
            <div className="xxs:block lg:hidden">
            <Image
                    src={originalSrc}
                    alt={altText}
                    width='600'
                    height='860'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => setShow2ndPic(true)}
                />
            </div>
        </div>
        <h3 className="mt-4 xxs:ml-2 sm:ml-0 text-lg font-medium text-white">{title}</h3>
        <p className='mt-1 xxs:ml-2 sm:ml-0 text-sm text-white'>
          {
            currency === '' ? formatter.format(price) :
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

export default WishlistProductCard