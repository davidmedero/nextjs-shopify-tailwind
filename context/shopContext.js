import { createContext, useState, useEffect, useLayoutEffect } from 'react'
import { createCheckout, updateCheckout } from '../lib/shopify'

const CartContext = createContext()

export default function shopProvider({ children }) {
    const [cart, setCart] = useState([])
    const [cartOpen, setCartOpen] = useState(false)
    const [checkoutId, setCheckoutId] = useState('')
    const [checkoutUrl, setCheckoutUrl] = useState('')
    const [currency, setCurrency] = useState('')

    useEffect(() => {
        if (localStorage.checkout_id) {
            const cartObject = JSON.parse(localStorage.checkout_id)

            if (cartObject[0].id) {
                setCart([cartObject[0]])
            } else if (cartObject[0].length > 0) {
                setCart(...[cartObject[0]])
            }

            setCheckoutId(cartObject[1].id)
            setCheckoutUrl(cartObject[1].webUrl)
        }

    }, [])

    useLayoutEffect(() => {
        setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        window.addEventListener('storage', () => {
          setCurrency(JSON.parse(localStorage.getItem('current_currency')))
        })
      }, [])

    const currencyCode = currency === 'USD' ? 'US' : currency === 'GBP' ? 'GB' : currency === 'EUR' ? 'FR' : 'US'

    async function addToCart(newItem) {
        setCartOpen(true)

        if (cart.length === 0) {
            setCart([newItem])

            const checkout = await createCheckout(newItem.id, newItem.variantQuantity, currencyCode)

            setCheckoutId(checkout.id)
            setCheckoutUrl(checkout.webUrl)

            localStorage.setItem("checkout_id", JSON.stringify([newItem, checkout]))
        } else {
            let newCart = []
            let added = false
            
            cart.map(item => {
                if (item.id === newItem.id) {
                    item.variantQuantity += newItem.newVariantQuantity
                    newCart = [...cart]
                    added = true
                    newItem.newVariantQuantity = 1
                } 
            })

            if (!added) {
                newCart = [...cart, newItem]
            }

            setCart(newCart)
            const newCheckout = await updateCheckout(checkoutId, newCart)
            localStorage.setItem("checkout_id", JSON.stringify([newCart, newCheckout]))
        }
    }

    async function removeCartItem(itemToRemove) {
        const updatedCart = cart.filter(item => item.id !== itemToRemove)

        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem("checkout_id", JSON.stringify([updatedCart, newCheckout]))

        if (cart.length === 1) {
            setCartOpen(false)
        }
    }

    async function clearCart() {

        cart.length = []

        setCart(cart)

        const newCheckout = await updateCheckout(checkoutId, cart)

        localStorage.setItem("checkout_id", JSON.stringify([cart, newCheckout]))
    }

    async function updateCartQuantity(newItem) {
        let newCart = []
        let added = false
            
        cart.map(item => {
            if (item.id === newItem.id) {
                newCart = [...cart]
                added = true
            }
        })

        if (!added) {
            newCart = [...cart, newItem]
        }

        setCart(newCart)
        const newCheckout = await updateCheckout(checkoutId, newCart)
        localStorage.setItem("checkout_id", JSON.stringify([newCart, newCheckout]))
    }


  return (
    <CartContext.Provider value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        checkoutUrl,
        removeCartItem,
        updateCartQuantity,
        clearCart
    }}>
        {children}
    </CartContext.Provider>
  )
}

const ShopConsumer = CartContext.Consumer

export { ShopConsumer, CartContext }
