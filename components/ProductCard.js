import { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"
import useSWR, { useSWRConfig } from "swr"
import axios from "axios"
import { useSession } from "next-auth/react"
import SignInModal from "./SignInModal"


const fetcher = url => axios.get(url).then(res => res.data)


const ProductCard = ({ product }) => {

  const { mutate } = useSWRConfig()

  const { data: session } = useSession()
  const email = session?.user.email

  const [showSignInModal, setShowSignInModal] = useState(false)

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

  const [heartFill, setHeartFill] = useState(false)

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Button Click');
  }, []);

  const [added, setAdded] = useState(false)

  const updateMacros = async () => {
    console.log('yes')
    if (added) {
      await fetch("https://nextjs-shopify-tailwind-wine.vercel.app/api/wishlist-endpoint", {
        method: 'delete',
        body: JSON.stringify(handle)
      })
    } else {
      await fetch("https://nextjs-shopify-tailwind-wine.vercel.app/api/wishlist-endpoint", {
        method: 'post',
        body: JSON.stringify(handle)
      })
    }
    mutate('/api/wishlist-endpoint')
  }

  const { data, error } = useSWR('/api/wishlist-endpoint', fetcher)

  const savedItems = data && data.map(el => {
    if (el.email === email) {
      return el.saved_items
    }
  }).filter(el => el != undefined)

  useEffect(() => {
    console.log(savedItems)
    if (savedItems) {
      if (savedItems[0]) {
        if (savedItems[0].includes(handle)) {
          setAdded(true)
        } else {
          setAdded(false)
        }
      }
    }
  }, [savedItems])


  return (
    <>
    <Link href={`/${handle}`}>
      <a className="group">
        <div className="line w-full bg-gray-200 overflow-hidden">
            <div className="xxs:hidden lg:block relative w-full h-full">
            {session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros()
              }}
              className="absolute right-[6px] top-1 z-[1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {!session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                setShowSignInModal(true)
              }}
              className="absolute right-[6px] top-1 z-[1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
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
            <div className="xxs:block lg:hidden relative w-full h-full">
            {session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros()
              }}
              className="absolute right-[6px] top-1 z-[1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {!session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                setShowSignInModal(true)
              }}
              className="absolute right-[6px] top-1 z-[1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
            </SignInModal>
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
        <h3 className="mt-2 xxs:ml-2 sm:ml-0 text-sm font-medium text-white">{title}</h3>
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

export default ProductCard