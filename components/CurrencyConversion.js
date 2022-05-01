import { useLayoutEffect, useEffect, useState, useRef, useContext } from "react"
import { CartContext } from '../context/shopContext'
import { createCheckout, updateCheckout } from '../lib/shopify'


export default function CurrencyConversion() {

    const { cart, addToCart, clearCart, setCart, setCartOpen, checkoutId, setCheckoutId, setCheckoutUrl } = useContext(CartContext)

    const ref = useRef()

    const CartRef = useRef()

    const cartRefLength = useRef()

    const checkoutIdRef = useRef()

    CartRef.current = cart

    cartRefLength.current = cart.length

    checkoutIdRef.current = checkoutId

    const [currentCurrency, setCurrentCurrency] = useState('USD')

    const [showCurrencies, setShowCurrencies] = useState(false)

    const [storedCart, setStoredCart] = useState([])

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
    
    useEffect(async () => {
        if (storedCart[0] && cart.length === 1) {
            clearCart()
            addToCart(storedCart[0])
        }
        if (storedCart[0] && cart.length > 1) {
            clearCart()
            const newArray = []
            for (let i of storedCart[0]) {
                newArray.push(i)
            }
            setCartState(newArray)
        }
    }, [storedCart])

    const [currency, setCurrency] = useState('')

    useLayoutEffect(() => {
        setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        window.addEventListener('storage', () => {
          setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        })
      }, [])

    const currencyCode = currency === 'USD' ? 'US' : currency === 'GBP' ? 'GB' : currency === 'EUR' ? 'FR' : 'US'

    useEffect(async () => {
        for (let i of cartState) {
            if (cartRefLength.current === 0) {
                setCartOpen(true)
                setCart([i])
                const checkout = await createCheckout(i.id, i.variantQuantity, currencyCode)
                console.log(cartRefLength.current, CartRef.current)
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
            {currentCurrency}
            {
            showCurrencies && (
                <div className="p-3 border absolute top-8 bg-white flex flex-col right-[1px]">
                    <div 
                    onClick={() => {
                        setCurrentCurrency('USD');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap mb-2">United States</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('GBP');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap mb-2">United Kingdom</div>
                    <div 
                    onClick={() => {
                        setCurrentCurrency('EUR');
                    }} 
                    className="hover:bg-pink-100 whitespace-nowrap">European Union</div>
                </div>
            )   
            }
            </div>
      </div>
    )
}
