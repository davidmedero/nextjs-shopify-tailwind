import { useLayoutEffect, useEffect, useState, useRef, useContext, Fragment } from "react"
import { CartContext } from '../context/shopContext'
import { createCheckout, updateCheckout } from '../lib/shopify'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Image from "next/image"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'


export default function CurrencyConversion({ show, onClose, closeMenu }) {

    const cancelButtonRef = useRef()

    const handlers = useSwipeable({
      onSwipedLeft: () => onClose(),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
    })

    const { cart, addToCart, clearCart, setCart, setCartOpen, checkoutId, setCheckoutId, setCheckoutUrl } = useContext(CartContext)

    const ref = useRef()

    const CartRef = useRef()

    const cartRefLength = useRef()

    const checkoutIdRef = useRef()

    const storedCartRef = useRef()

    CartRef.current = cart

    cartRefLength.current = cart.length

    checkoutIdRef.current = checkoutId

    const [currentCurrency, setCurrentCurrency] = useState('')

    const [hoverCurrencies, setHoverCurrencies] = useState(false)

    const [showCurrencies, setShowCurrencies] = useState(false)

    const [storedCart, setStoredCart] = useState([])
    storedCartRef.current = storedCart

    const [cartState, setCartState] = useState([])

    useLayoutEffect(() => {
        if (localStorage.getItem("checkout_id")) {
            setStoredCart(JSON.parse(localStorage.getItem("checkout_id")))
        }

        storedCart.map(el => {
            if (el.buyerIdentity !== undefined) {
                currentCurrency === 'USD' ? {
                    ...el.buyerIdentity,
                    countryCode: 'US'
                } :
                currentCurrency === 'GBP' ? {
                    ...el.buyerIdentity,
                    countryCode: 'GB'
                } :
                currentCurrency === 'EUR' ? {
                    ...el.buyerIdentity,
                    countryCode: 'FR'
                } : 
                null
            }
            if (el.totalPriceV2 !== undefined) {
                currentCurrency === 'USD' ? {
                    ...el.totalPriceV2,
                    currencyCode: 'USD'
                } :
                currentCurrency === 'GBP' ? {
                    ...el.totalPriceV2,
                    currencyCode: 'GBP'
                } :
                currentCurrency === 'EUR' ? {
                    ...el.totalPriceV2,
                    currencyCode: 'EUR'
                } :
                null
            }
            if (el.lineItems !== undefined) {
                currentCurrency === 'USD' ? el.lineItems.edges.map(el => {
                    if (el.node.variant !== undefined) {
                        return {
                            ...el.node.variant.priceV2,
                            currencyCode: 'USD'
                        }
                    }
                }) :
                currentCurrency === 'GBP' ? el.lineItems.edges.map(el => {
                    if (el.node.variant !== undefined) {
                        return {
                            ...el.node.variant.priceV2,
                            currencyCode: 'GBP'
                        }
                    }
                }) :
                currentCurrency === 'EUR' ? el.lineItems.edges.map(el => {
                    if (el.node.variant !== undefined) {
                        return {
                            ...el.node.variant.priceV2,
                            currencyCode: 'EUR'
                        }
                    }
                }) :
                null
            }
        })
    }, [currentCurrency])

    const [currency, setCurrency] = useState('')

    const currencyCode = currency === 'USD' ? 'US' : currency === 'GBP' ? 'GB' : currency === 'EUR' ? 'FR' : 'US'
    
    useEffect(() => {
        if (currentCurrency !== '') {
            for (let i of storedCart) {
                if ((Object.prototype.toString.call(storedCart[0]) !== '[object Array]')) {
                    clearCart()
                    setCartOpen(true)
                    addToCart(storedCart[0])
                    localStorage.setItem("checkout_id", JSON.stringify(storedCart))
                }
                if ((Object.prototype.toString.call(storedCart[0]) === '[object Array]') && (storedCart[0].length === 1)) {
                    clearCart()
                    setCartOpen(true)
                    addToCart(JSON.parse(JSON.stringify(storedCart[0]).replace(/[\[\]']+/g,'')))
                    localStorage.setItem("checkout_id", JSON.stringify(storedCart))
                }
            }
            if ((storedCart[0]?.length > 1) && (cart.length > 1)) {
                clearCart()
                const newArray = []
                for (let i of storedCart[0]) {
                    newArray.push(i)
                }
                setCartState(newArray)
            }
        }
    }, [storedCart])

    useLayoutEffect(() => {
        setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        window.addEventListener('storage', () => {
          setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        })
      }, [])

    useEffect(async () => {
        for (let i of cartState) {
            if (cartRefLength.current === 0) {
                setCartOpen(true)
                setCart([i])
                const checkout = await createCheckout(i.id, i.variantQuantity, currencyCode)
                setCheckoutId(checkout.id)
                setCheckoutUrl(checkout.webUrl)
                localStorage.setItem("checkout_id", JSON.stringify([i, checkout]))
            } else {
                let newCart = []
                newCart = [...CartRef.current, i]
                setCart(newCart)
                await updateCheckout(checkoutIdRef.current, newCart)
                localStorage.setItem("checkout_id", JSON.stringify(storedCart))
            }
        }
    }, [cartState])

    const toggleCurrencies = () => {
        setShowCurrencies(checked => !checked)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowCurrencies(false)
            }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    useLayoutEffect(() => {
        if (localStorage.getItem('current_currency')) {
            setCurrentCurrency(JSON.parse(localStorage.getItem('current_currency')))
        } else {
            localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('current_currency', JSON.stringify(currentCurrency))
        window.dispatchEvent(new Event("storage"))
    }, [currentCurrency])


    return (
        <>
        <div 
        onMouseOver={() => setHoverCurrencies(true)}
        onMouseLeave={() => setHoverCurrencies(false)}
        className="xxs:hidden lg:block flex flex-col items-center cursor-pointer relative select-none text-white">
        <div className="relative z-[9999] px-[6px] lg:hover:scale-[1.2] transition-transform duration-200 ease-in-out">
            {
              (currentCurrency === 'GBP' || currentCurrency === 'EUR') ? (
               <div className="flex items-center h-[28px] w-[28px] lg:hover:scale-[1.1] transition-transform duration-200 ease-in-out">
              {currentCurrency}
                </div>
                ) : 
                currentCurrency === 'USD' || !currentCurrency ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="top-[1px] h-[28px] w-[28px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>  
              ) : ''
            }
            </div>
            <div 
            className="top-[28px] bg-black pb-2 px-4 absolute flex flex-col right-0">
            <SlideDown className={'my-dropdown-slidedown'}>
            {
            hoverCurrencies && (
                <div className="mt-[10px] pb-[9px] border-t-[6px] border-black">
                    <div className={!currentCurrency || currentCurrency === 'USD' ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className={!currentCurrency || currentCurrency === 'USD' ? "pointer-events-none flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap" : "flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap"}>
                        <Image src="/um.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        <div>United States</div>
                        </div>
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap">
                         <Image src="/gb.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        United Kingdom
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }} 
                    className="flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap">
                        <Image src="/eu.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        European Union
                        </div>
                </div>
            )   
            }
            </SlideDown>
            </div>
            
      </div>

      <div
      ref={ref} onClick={() => toggleCurrencies()} 
      className="xxs:block lg:hidden px-[6px] flex flex-col cursor-pointer select-none text-white">
        <div className="relative z-[9999] flex items-center lg:hover:scale-[1.3] transition-all duration-200 ease-in-out">
        {
              (currentCurrency === 'GBP' || currentCurrency === 'EUR') ? (
               <div className="flex items-center h-[28px] w-[28px] lg:hover:scale-[1.1] transition-transform duration-200 ease-in-out">
              {currentCurrency}
                </div>
                ) : 
                currentCurrency === 'USD' || !currentCurrency ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="relative top-[1px] z-[9999] h-[28px] w-[28px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>  
              ) : ''
            }
            </div>
            <div 
            className="xxs:hidden xs:!flex top-[30px] bg-black py-2 px-4 absolute flex-col right-0">
            <SlideDown className={'my-dropdown-slidedown'}>
            {
            showCurrencies && (
                <div className="mt-[10px] pb-[9px] border-t-[6px] border-black">
                    <div className={!currentCurrency || currentCurrency === 'USD' ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className={!currentCurrency || currentCurrency === 'USD' ? "pointer-events-none flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap" : "flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap"}>
                        <Image src="/um.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        <div>United States</div>
                        </div>
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap">
                         <Image src="/gb.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        United Kingdom
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }} 
                    className="flex flex-row items-center w-[200px] justify-between hover:bg-gray-800 p-2 whitespace-nowrap">
                        <Image src="/eu.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        European Union
                        </div>
                </div>
            )   
            }
            </SlideDown>
            </div>
      </div>

    <div className="xxs:block xs:!hidden">
      <Transition.Root show={show ? show : false} as={Fragment} {...handlers}>
        <Dialog 
        {...handlers}
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-[60] inset-0 overflow-hidden" 
        onClose={() => {
            closeMenu();
            onClose();
        }}>
          <div {...handlers} className="absolute inset-0 overflow-hidden">
            <Transition.Child
            {...handlers}
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay {...handlers} className="absolute inset-0" />
            </Transition.Child>
            <div {...handlers} className="fixed inset-y-0 left-0 max-w-full flex overflow-hidden">
              <Transition.Child
                {...handlers}
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-600"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-600"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                >
                  <div className="p-6 w-screen sm:max-w-md bg-black overflow-y-scroll">
                    <div className="flex justify-between items-center relative bottom-1">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white"
                        onClick={() => {
                            onClose();
                            }}>

                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <Dialog.Title className="text-xl font-semibold mx-auto text-white">Currencies</Dialog.Title>
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-mx-2 -my-[10px] p-2 text-white"
                        onClick={() => {
                            closeMenu();
                            onClose();
                        }}
                        >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="pb-[9px] mt-[37px] text-lg">
                    <div className={!currentCurrency || currentCurrency === 'USD' ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className="flex flow-row items-center w-full justify-between border-b text-white">
                    <div 
                    className={!currentCurrency || currentCurrency === 'USD' ? "pointer-events-none h-[75px] flex flex-row items-center p-2 whitespace-nowrap" : "flex h-[75px] flex-row items-center p-2 whitespace-nowrap"}>
                        <Image src="/um.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        <div className={currentCurrency === 'USD' ? "text-[#ff00a7] ml-9" : "text-white ml-9"}>United States</div>
                        </div>
                            {
                            currentCurrency === 'USD' ?
                                (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="#ff00a7" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                 </svg>) :
                                (<span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                                </span>)
                            }
                        </div>
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="flex flow-row items-center w-full justify-between border-b text-white">
                    <div 
                    className="flex h-[75px] flex-row items-center w-full p-2 whitespace-nowrap">
                         <Image src="/gb.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        <div className={currentCurrency === 'GBP' ? "text-[#ff00a7] ml-9" : "text-white ml-9"}>United Kingdom</div>
                        </div>
                            {
                            currentCurrency === 'GBP' ?
                                (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="#ff00a7" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                 </svg>) :
                                (<span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                                </span>)
                            }
                        </div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }}
                    className="flex flow-row items-center w-full justify-between border-b text-white">
                    <div  
                    className="flex h-[75px] flex-row items-center w-full p-2 whitespace-nowrap">
                        <Image src="/eu.svg" width="40" height="30" layout="fixed" objectFit="cover" />
                        <div className={currentCurrency === 'EUR' ? "text-[#ff00a7] ml-9" : "text-white ml-9"}>European Union</div>
                        </div>
                            {
                            currentCurrency === 'EUR' ?
                                (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="#ff00a7" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                 </svg>) :
                                (<span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                                </span>)
                            }
                        </div>
                </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      </div>
      </>
    )
}
