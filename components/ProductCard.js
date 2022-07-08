import { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react"
import Link from 'next/link'
import Image from 'next/image'
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"
import useSWR, { useSWRConfig } from "swr"
import axios from "axios"
import { useSession } from "next-auth/react"
import SignInModal from "./SignInModal"
import colors from '../colors.js'


const fetcher = url => axios.get(url).then(res => res.data)


const ProductCard = ({ product, filteredColorPic, filteredShade }) => {

  const { mutate } = useSWRConfig()

  const { data: session } = useSession()
  const email = session?.user.email

  const [showSignInModal, setShowSignInModal] = useState(false)

  const { handle, title } = product.node

  const { originalSrc } = product.node.images.edges[0].node

  const [colorTracker, setColorTracker] = useState('')

  const [secondVariantImage, setSecondVariantImage] = useState('')

  const fisrtImgArray = []
  const secondImgArray = []

  product.node.options?.map(({ values }) => (
    values.map(value => {
      product.node.variants.edges.map(el => {
        if ((el.node.title === (value + ' / ' + product.node.variants.edges[1].node.selectedOptions[1]?.value))) {
          fisrtImgArray.push(el.node.image.originalSrc)
        } else if ((el.node.title === (value + ' / ' + product.node.variants.edges[2].node.selectedOptions[1]?.value))) {
          secondImgArray.push(el.node.image.originalSrc)
        }
      })
    })
  ))

  const combinedArray = fisrtImgArray.map((x, i) => {
    return {
      first: x,
      second: secondImgArray[i]
    }
  })

  const showSecondImage = (firstImage) => {
    combinedArray.map(el => {
      if (firstImage === el.first) {
        setSecondVariantImage(el.second)
      }
    })
  }

  const secondPicSrc = product.node.images.edges[1].node.originalSrc

  const [show2ndPic, setShow2ndPic] = useState(false)

  const [variantPic, setVariantPic] = useState('')

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
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const [added, setAdded] = useState(false)

  const updateMacros = async () => {
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

  const [variantLink, setVariantLink] = useState('')

  const firstLinkArray = []
  const colorLinkArray = []

  product.node.options?.map(({ values }) => (
    values.map(value => {
      product.node.variants.edges.map(el => {
        if ((el.node.title === (value + ' / ' + product.node.variants.edges[1].node.selectedOptions[1]?.value))) {
          firstLinkArray.push(el.node.image.originalSrc)
          colorLinkArray.push(`/${handle}` + '?color=' + value)
        }
      })
    })
  ))

  const combinedLinkArray = firstLinkArray.map((x, i) => {
    return {
      firstImg: x,
      handle: colorLinkArray[i]
    }
  })

  const firstImgLink = (val) => {
    combinedLinkArray.map(el => {
      if (val === el.firstImg) {
        setVariantLink(el.handle)
      }
    })
  }

  useEffect(() => {
    if (filteredColorPic && filteredColorPic.length !== 0) {

      const checkedColorVals = Object.values(colors.filter(color => {
        return filteredColorPic.join('') == Object.keys(color)
      })[0])[0]

      product.node.variants?.edges.map(el => {
          if (el.node.title.toLowerCase().includes(filteredColorPic.join('').toLowerCase() + ' / ' + product.node.variants.edges[1].node.selectedOptions[1]?.value.toLowerCase())) {
            setVariantPic(el.node.image.originalSrc)
            setColorTracker(el.node.selectedOptions[0].value)
          } else if (checkedColorVals.some(val => el.node.title.toLowerCase().split(' ').includes(val))) {
            setVariantPic(el.node.image.originalSrc)
            setColorTracker(el.node.selectedOptions[0].value)
          }
      })
    }

  }, [filteredColorPic])

  useEffect(() => {
    if (filteredShade && filteredShade.length !== []) {

      product.node.variants?.edges.map(el => {
        if (el.node.title.toLowerCase().includes(filteredShade.join('').toLowerCase() + ' / ' + product.node.variants.edges[1].node.selectedOptions[1]?.value.toLowerCase())) {
          setVariantPic(el.node.image.originalSrc)
          setColorTracker(el.node.selectedOptions[0].value)
        }
      })
    }

  }, [filteredShade])


  return (
    <>
    {
      product.node.variants?.edges[0].node.selectedOptions[0].name !== 'Color' ? (
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
              {
                show2ndPic ? (
                  <Image
                    src={secondPicSrc}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseLeave={() => setShow2ndPic(false)}
                />
                ) : (
                  <Image
                  src={originalSrc}
                  width='500'
                  height='800'
                  layout="responsive"
                  objectFit="cover"
                  style={{display: 'inline-block', width: 'full' }}
                  onMouseOver={() => setShow2ndPic(true)}
              />
                )
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
            </SignInModal>
            <Image
                    src={originalSrc}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => setShow2ndPic(true)}
                />
            </div>
        </div>
        <h3 className="mt-2 xxs:ml-2 text-sm font-medium text-white">{title}</h3>
        <p className='mt-1 xxs:ml-2 text-sm text-white'>
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
      ) : (
        <Link href={`${variantLink}`}>
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
              {
                secondVariantImage ? (
                  <Image
                    src={secondVariantImage}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseLeave={() => setSecondVariantImage('')}
                  />
                )
                : variantPic ? (
                  <Image
                    src={variantPic}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => {firstImgLink(variantPic); showSecondImage(variantPic)}}
                />
                ) : (
                  <Image
                    src={originalSrc}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => {firstImgLink(originalSrc); showSecondImage(originalSrc)}}
                />
                )
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "black"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
            </SignInModal>
            <Image
                    src={originalSrc}
                    width='500'
                    height='800'
                    layout="responsive"
                    objectFit="cover"
                    style={{display: 'inline-block', width: 'full' }}
                    onMouseOver={() => setShow2ndPic(true)}
                />
            </div>
        </div>
        <div className="inline-flex items-center flex-wrap mt-4 xxs:ml-3">
        {
          product.node.options?.map(({ name, values }) => (
            values.map(value => {
              const id = `option-${name}-${value}`
  
              const colorPicLookup = product.node.variants.edges.map(el => (
                (el.node.title === (value + ' / ' + product.node.variants.edges[0].node.selectedOptions[1]?.value))
              ))
  
              const colorPicIndex = colorPicLookup.findIndex(el => el === true)

              const variantImageSrc = product.node.variants.edges.map(el => {
                  if (el.node.title === (value + ' / ' + product.node.variants.edges[1].node.selectedOptions[1]?.value)) {
                    return el.node.image.originalSrc
                  }
              }).filter(el => el !== undefined).join('')
              
              return (
                <label key={id} htmlFor={id} className="cursor-pointer">
                  <input
                    className="sr-only"
                    type="radio"
                    id={id}
                    name={`option-${name}`}
                    value={value}
                  />
                  {
                    name === 'Color' && colorPicIndex !== -1 && (
                      <Link href={`/${handle}?color=${value}`}>
                        <a>
                          <div 
                          onMouseOver={() => {setVariantPic(variantImageSrc); setColorTracker(value)}}
                          className={`w-8 h-8 rounded-full mr-5 box-border border-2 border-black ring-2 ring-white ${colorTracker.toLowerCase() === value.toLowerCase() && "!ring-4 ring-white border-4"}`}>
                            <Image src={product.node.variants.edges[colorPicIndex]?.node.image.originalSrc} className="rounded-full" width='500' height='500' layout="responsive" objectFit="cover" />
                          </div>
                        </a>
                      </Link>
                    )
                  }
                </label>
              )
            }) 
          ))
        }
        </div>
        <h3 className="mt-2 xxs:ml-2 text-sm font-medium text-white">{title}</h3>
        <p className='mt-1 xxs:ml-2 text-sm text-white'>
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
      )
    }
    
    </>
  )
}

export default ProductCard