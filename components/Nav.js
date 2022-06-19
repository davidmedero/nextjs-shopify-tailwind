import Link from 'next/link'
import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { CartContext } from '../context/shopContext'
import Cart from './Cart'
import SignInButton from './SignInButton'
import collections from '../categories'
import MobileMenuButton from './MobileMenuButton'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { useRouter } from 'next/router'
import CurrencyConversion from './CurrencyConversion'
// import { isChrome, isIPhone13, isIPad13, isMobile } from 'react-device-detect'
import Image from 'next/image'
import WishlistButton from './WishlistButton'


export default function Nav() {

  const router = useRouter()

  const ref = useRef()

  const inputRef = useRef()

  const mobileInputRef = useRef()

  const focusRef = useRef()

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

  const cartCurrency = currency === 'USD' ? 1 : currency === 'GBP' ? (GBPcurrency * shopifyConversionFee) : currency === 'EUR' ? (EURcurrency * shopifyConversionFee) : 1

  const { cart, cartOpen, setCartOpen } = useContext(CartContext)

  let cartQuantity = 0
  cart.map(item => {
      return (cartQuantity += item?.variantQuantity)
  })

  let cartTotal = 0
  cart.map(item => {
      cartTotal += Math.ceil(item?.variantPrice * cartCurrency) * item?.variantQuantity
  })

  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryHandle, setCategoryHandle] = useState('')

  const subcategories = collections.map(category => {
      return category.subcollections
  })

  const findCategory = (e) => {
      setCategoryIndex(collections.findIndex(el => el.id === JSON.parse(e.target.dataset.info).id))
  }

  const getCategoryHandle = (e) => {
      setCategoryHandle(collections.find(el => el.id === JSON.parse(e.target.dataset.info).id).handle)
  }
  
  const [showSubMenu, setShowSubMenu] = useState(false)

  const [showMenu, setShowMenu] = useState(true)

  const [inputState, setInputState] = useState('')
  inputRef.current = inputState

  const [mobileinputState, setMobileInputState] = useState('')
  mobileInputRef.current = mobileinputState

  const [focusState, setFocusState] = useState('')
  focusRef.current = focusState

  function toggleMenu() {
    if (document.getElementById('input')) {
      document.getElementById('input').value = '';
    }
    setShowMenu(checked => !checked)
  }

  useEffect(()=>{
    if (focusRef.current) {
      focusRef.current.focus();
    }
  },[showMenu])

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && (event.target !== mobileInputRef.current) && (event.target !== focusRef.current) && (event.target !== document.getElementById('input')) && (event.target !== document.getElementById('mobile-input'))) {
        if (document.getElementById('input')) {
          document.getElementById('input').value = '';
        }
        setShowMenu(true)
      }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

  const queryRef = useRef()

  const [query, setQuery] = useState("")
  queryRef.current = query

  useEffect(() => {
    if (query.length > 2) {
      router.push({pathname: `/search`, query: {query: query}});
    }
  }, [query])

  const [showSubtotal, setShowSubtotal] = useState(false)


  return (
    <header className='border-b-4 border-b-gray-900 sticky top-0 z-20 bg-black'>
        <div className={(showMenu ? 'flex items-center justify-between max-w-full xxs:py-3 xxs:px-[15px] mx-auto transition-all duration-300 ease-in-out' : 'flex items-center justify-between max-w-full xxs:py-3 xxs:px-[15px] mx-auto xxs:pb-20 lg:pb-[12px] transition-all duration-300 ease-in-out')}>
            <div className="xxs:flex lg:!hidden">
            <MobileMenuButton />
            </div>
            <Link href="/" passHref>
                <a className='cursor-pointer'>
                    <span className='xxs:hidden lg:block lg:top-[10px] lg:absolute lg:hover:scale-110 search:!right-[calc(35%-80px)] xs:!right-[calc(30%-66px)] sm:!right-[calc(30%-76px)] md:right-[calc(40%-100px)] lg:!right-[unset] bottom-2 text-2xl pt-1 select-none transition-all ease-in-out duration-300'>
                        <Image src="/logo.png" width="200" height="31" layout="fixed" objectFit="cover" />
                    </span>
                    <span className='xxs:hidden mini:!block lg:!hidden  xxs:relative xxs:top-[2px] xxs:right-[calc(35%-69px)] xs:!right-[calc(30%-66px)] text-2xl pt-1 select-none transition-all ease-in-out duration-300'>
                        <Image src="/logo.png" width="170" height="25" layout="fixed" objectFit="cover" />
                    </span>
                    <span className='xxs:block mini:!hidden xxs:relative xxs:top-[2px] xxs:right-[calc(35%-60px)] xs:!right-[calc(30%-66px)] text-2xl select-none transition-all ease-in-out duration-300'>
                        <Image src="/logo.png" width="150" height="23" layout="fixed" objectFit="cover" />
                    </span>
                </a>
            </Link>
            <div className='xxs:hidden lg:!block lg:relative lg:left-[103px] xl:left-[95px]'>
              <div>
              {
                showMenu && (
                  collections.map(collection => (
                      collection.handle == "shop" ?
                      (<Link href={'/shop-brands'} >
                      <a className="lg:text-[12px] xl:text-sm p-6 text-white hover:text-[#ff00a7] select-none"
                      data-info={JSON.stringify(collection)}
                      onMouseEnter={(e) => {
                          setShowSubMenu(true);
                          findCategory(e);
                          getCategoryHandle(e);
                          }}
                          onMouseLeave={() => setShowSubMenu(false)}
                          onClick ={() => setShowSubMenu(false)}>
                          {collection.title.toUpperCase()}
                      </a>
                      </Link>) :
                      (<Link href={'/' + collection.handle} >
                          <a className="lg:text-[12px] xl:text-sm p-6 text-white hover:text-[#ff00a7] select-none"
                          data-info={JSON.stringify(collection)}
                          onMouseEnter={(e) => {
                              setShowSubMenu(true);
                              findCategory(e);
                              getCategoryHandle(e);
                              }}
                              onMouseLeave={() => setShowSubMenu(false)}
                              onClick ={() => setShowSubMenu(false)}>
                              {collection.title.toUpperCase()}
                          </a>
                      </Link>)
                  ))
                )
              }
              {
                !showMenu ? (
                  <div className='flex'>
                  <input
                  ref={focusRef}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete='off'
                  autoFocus
                  id='input' type="text" placeholder="Search..." name="input" className="border-b border-b-white border-black lg:w-[400px] xl:w-[500px] text-white bg-black" />
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  </div>
                ) : (
                  <div className='hidden'>
                  <input />
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="white">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  </div>
                )
              }
               
              </div>
            </div>
            <div className='flex items-center justify-center relative xxs:left-[8px] cursor-pointer'>
              <div 
              className='px-[6px] relative lg:hover:scale-[1.3] transition-all duration-200 ease-in-out'
              ref={ref}
              onClick={() => {
                toggleMenu();
                }} >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            <WishlistButton />
              <div className='xxs:hidden xs:!block'>
                <SignInButton />
              </div>
            <a 
            id='slide-toggle'
            className='px-[6px] cursor-pointer flex justify-center items-center lg:hover:scale-[1.2] transition-all duration-200 ease-in-out relative z-50'
            onClick={() => setCartOpen(!cartOpen)}
            onMouseOver={() => setShowSubtotal(true)}
            onMouseLeave={() => setShowSubtotal(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-[9999]" fill="none" viewBox="0 0 24 24" stroke={cartQuantity > 0 ? '#ff00a7' : "white"} stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg> 
            </a>
            <Cart cart={cart} />
              <div className='xxs:hidden xs:!block'>
                <CurrencyConversion />
              </div>
            </div>
        </div>
        <div className={!showMenu ? 'xxs:opacity-100 lg:hidden xxs:transition-opacity xxs:ease-in-out xxs:duration-700' : 'xxs:opacity-0'}>
        <div className='xxs:absolute xxs:top-20 xxs:left-[50%] xxs:-translate-x-1/2 lg:hidden'>
          {
          !showMenu && (
                  <div className='xxs:flex xxs:rounded-none'>
                    <input
                    onChange={(e) => setQuery(e.target.value)}
                    ref={mobileInputRef}
                    autoComplete='off'
                    autoFocus
                    id="mobile-input" type="text" placeholder="Search..." className="xxs:border-b-white xxs:border-b xxs:w-[80vw] md:w-[60vw] xxs:rounded-none bg-black text-white" />
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="white">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>)
                  }
              </div>
                </div>
              <div className="absolute w-full flex flex-col justify-center bg-black">
              <SlideDown className={'my-dropdown-slidedown'}>
        {
          showSubMenu && (
          <div
          onMouseEnter={() => setShowSubMenu(true)}
          onMouseLeave={() => setShowSubMenu(false)}
          className="relative pb-8 w-full flex flex-col justify-center shadow-md border-b-4 border-b-gray-900 bg-black">
              {
            <div className="flex justify-center bg-black">
              {subcategories[categoryIndex].map(subcategory => (
                <div>
                    {
                    subcategory.handle === "" ? (
                        <div className="relative">
                        <div className='font-semibold text-white flex p-6 pointer-events-none'>
                            {subcategory.title.toUpperCase()}
                        </div>
                        </div>
                    ) : 
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative cursor-pointer">
                            <a className='font-semibold text-white flex p-6 cursor-pointer hover:text-[#ff00a7] select-none'>
                                {subcategory.title.toUpperCase()}
                            </a>
                        </div>
                    </Link>)
                    }
                  {subcategory.sub_subcollections?.map(sub_subcategory => (
                      subcategory.handle === "" ? (
                        <Link href={'/' + categoryHandle + '/' + sub_subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative cursor-pointer">
                          <a className='flex py-1 px-6 text-gray-300 cursor-pointer hover:text-[#ff00a7] select-none'>
                            {sub_subcategory.title.toUpperCase()}
                          </a>
                       </div>
                    </Link> 
                      ) :
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative cursor-pointer">
                          <a className='flex py-1 px-6 text-gray-300 cursor-pointer hover:text-[#ff00a7] select-none'>
                            {sub_subcategory.title.toUpperCase()}
                          </a>
                       </div>
                    </Link>)
                  ))}
                </div>
              ))}
            </div>
              }
          </div>
          )
        }
        </SlideDown>
        </div>
        <div className="xxs:hidden lg:block absolute right-[54px] top-[60px] w-[200px] flex flex-col justify-center select-none text-sm !overflow-x-hidden">
        <SlideDown className={'my-dropdown-slidedown'}>
        {
          ((showSubtotal) && (cartQuantity > 0)) ? (
            <div className='pt-[15px] border-b-4 border-b-gray-900 bg-black py-2 px-4 relative flex flex-col border-t-black pb-3 -mt-1 left-[15px] !overflow-x-hidden'>
              <div className='flex flex-row justify-between pb-2'>
                <span className='text-white relative'>QUANTITY:</span>
                <span className='text-white relative'>{cartQuantity}</span>
              </div>
              <div className='flex flex-row justify-between'>
                <span className='text-white relative'>SUBTOTAL:</span>
                <span className='text-white relative'>${cartTotal}</span>
              </div>
              </div>
          ) : ((showSubtotal) && (cartQuantity === 0)) ? (
            <div className='border-b-4 border-b-gray-900 bg-black py-2 pb-4 px-4 relative flex !w-[170px] left-[45px] -mt-1 !overflow-x-hidden'>
            <div className='flex flex-row justify-between'>
              <span className='text-white relative top-1 text-base'>Your Bag is Empty!</span>
            </div>
            </div>
          ) : null
        }
        </SlideDown>
        </div>
    </header>
  )
}
