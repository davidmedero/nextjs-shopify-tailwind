import { useLayoutEffect, useEffect, useState, useRef, useContext } from "react"
import { CartContext } from '../context/shopContext'


export default function CurrencyConversion() {

    const { cart, addToCart, clearCart, updateCart } = useContext(CartContext)

    const ref = useRef()

    const [currentCurrency, setCurrentCurrency] = useState('USD')

    const [showCurrencies, setShowCurrencies] = useState(false)

    const [storedCart, setStoredCart] = useState([])

    useLayoutEffect(() => {
        if (localStorage.getItem("checkout_id")) {
            setStoredCart(JSON.parse(localStorage.getItem("checkout_id")))
        }
    }, [currentCurrency])

    storedCart.map(el => {
        if (el.buyerIdentity !== undefined) {
            currentCurrency === 'USD' ? el.buyerIdentity.countryCode = 'US' :
            currentCurrency === 'GBP' ? el.buyerIdentity.countryCode = 'GB' :
            currentCurrency === 'EUR' ? el.buyerIdentity.countryCode = 'FR' : 
            null
        }
        if (el.totalPriceV2 !== undefined) {
            currentCurrency === 'USD' ? el.totalPriceV2.currencyCode = 'USD' :
            currentCurrency === 'GBP' ? el.totalPriceV2.currencyCode = 'GBP' :
            currentCurrency === 'EUR' ? el.totalPriceV2.currencyCode = 'EUR' :
            null
        }
        if (el.lineItems !== undefined) {
            currentCurrency === 'USD' ? el.lineItems.edges.map(el => {
                if (el.node.variant !== undefined) {
                    el.node.variant.priceV2.currencyCode = 'USD'
                }
            }) :
            currentCurrency === 'GBP' ? el.lineItems.edges.map(el => {
                if (el.node.variant !== undefined) {
                    el.node.variant.priceV2.currencyCode = 'GBP'
                }
            }) :
            currentCurrency === 'EUR' ? el.lineItems.edges.map(el => {
                if (el.node.variant !== undefined) {
                    el.node.variant.priceV2.currencyCode = 'EUR'
                }
            }) :
            null
        }
    })

    useEffect(() => {
        if (cart.length !== 0 && cart.length === 1) {
            clearCart()
            addToCart(storedCart[0])
        }
        if (cart.length !== 0 && cart.length > 1) {
            clearCart()
            // for (let i of storedCart[0]) {
            //     addToCart(i)
            // }
            // storedCart[0]?.forEach(element => {
            //     addToCart(element)
            // });
            storedCart[0]?.forEach(function (el, index) {
                setTimeout(function () {
                  console.log(cart);
                  addToCart(el);
                  cart.push(el);
                }, index * 1000);
              });
        }
    }, [storedCart])
    
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
