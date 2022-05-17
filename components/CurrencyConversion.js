import { useLayoutEffect, useEffect, useState, useRef, useContext } from "react"
import { CartContext } from '../context/shopContext'
import { createCheckout, updateCheckout } from '../lib/shopify'


export default function CurrencyConversion() {

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
                console.log(el.buyerIdentity)
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
                    console.log('object')
                    clearCart()
                    setCartOpen(true)
                    addToCart(storedCart[0])
                    localStorage.setItem("checkout_id", JSON.stringify(storedCart))
                }
                if ((Object.prototype.toString.call(storedCart[0]) === '[object Array]') && (storedCart[0].length === 1)) {
                    console.log('array')
                    clearCart()
                    setCartOpen(true)
                    addToCart(JSON.parse(JSON.stringify(storedCart[0]).replace(/[\[\]']+/g,'')))
                    localStorage.setItem("checkout_id", JSON.stringify(storedCart))
                }
            }
            if ((storedCart[0]?.length > 1) && (cart.length > 1)) {
                console.log('many')
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
      <div className="flex flex-col ml-4 cursor-pointer relative select-none">
        <div ref={ref} onClick={() => toggleCurrencies()}>
            {
              (currentCurrency === 'USD' || currentCurrency === 'GBP' || currentCurrency === 'EUR') ? '' : (
                <svg xmlns="http://www.w3.org/2000/svg" class="h-[25px] w-[25px] hover:scale-[1.3] transition-all duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="green" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>  
              ) 
            }
                {currentCurrency}
            {
            showCurrencies && (
                <div className="border absolute top-8 bg-white flex flex-col right-[1px]">
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className="hover:bg-pink-100 p-3 whitespace-nowrap">United States</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="hover:bg-pink-100 p-3 whitespace-nowrap">United Kingdom</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }} 
                    className="hover:bg-pink-100 p-3 whitespace-nowrap">European Union</div>
                </div>
            )   
            }
            </div>
      </div>
    )
}
