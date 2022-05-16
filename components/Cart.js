import { Fragment, useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import { CartContext } from '../context/shopContext'
import { formatter, GBPFormatter, EURFormatter } from '../utils/helpers'
import { useSwipeable } from 'react-swipeable';


export default function Cart({ cart }) {
  const cancelButtonRef = useRef()

  const { cartOpen, setCartOpen, checkoutUrl, removeCartItem, updateCartQuantity } = useContext(CartContext)

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

  let cartTotal = 0
  cart.map(item => {
      cartTotal += Math.ceil(item?.variantPrice * cartCurrency) * item?.variantQuantity
  })

  const [inputValue, setInputValue] = useState(1);

  const increment = (product_id) => {
    let item = cart.find(el => el.id === product_id)
    item.variantQuantity += 1
    setInputValue(item.variantQuantity)
    updateCartQuantity(item)
  }

  const decrement = (product_id) => {
    let item = cart.find(el => el.id === product_id)
    setInputValue(item.variantQuantity)
    if (item.variantQuantity > 1) {
      item.variantQuantity -= 1
      setInputValue(item.variantQuantity)
      updateCartQuantity(item)
    }
  }

  const handleChange = (id, e) => {
    let item = cart.find(el => el.id === id)
    item.variantQuantity = Number.parseFloat(e)
    setInputValue(item.variantQuantity)
    updateCartQuantity(item)
  }

  const updateState = (id) => {
    let item = cart.find(el => el.id === id)
    item.variantQuantity = 1
    setInputValue(item.variantQuantity)
  }

  const handlers = useSwipeable({
    onSwipedRight: () => setCartOpen(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });


  return (
    <Transition.Root show={cartOpen} as={Fragment} {...handlers}>
      <Dialog 
      {...handlers}
      initialFocus={cancelButtonRef}
      as="div" 
      className="fixed z-50 inset-0 overflow-hidden" 
      onClose={() => setCartOpen(!cartOpen)}>
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
            <Dialog.Overlay {...handlers} className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div {...handlers} className="fixed inset-y-0 right-0 sm:pl-10 max-w-full flex">
            <Transition.Child
            {...handlers}
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-600"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-600"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div {...handlers} className="w-screen max-w-full sm:max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                        ref={cancelButtonRef}
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setCartOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div {...handlers} className="mt-8">
                      <div className="flow-root">
                          {
                              cart.length > 0 ?
                              <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cart.map((product) => (
                            <li key={product.id + Math.random()} className="py-6 flex">
                              <div className="relative flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                    <Link href={`/${product.handle}`} passHref>
                                      <a onClick={() => setCartOpen(false)}>{product.title}</a>
                                    </Link>
                                    </h3>
                                    <p className="ml-4">{
                                      currency === '' ? formatter.format(product.variantPrice) :
                                      currency === 'USD' ? formatter.format(product.variantPrice) :
                                      currency === 'GBP' ? GBPFormatter.format(Math.ceil(product.variantPrice * GBPcurrency * shopifyConversionFee)) :
                                      currency === 'EUR' ? EURFormatter.format(Math.ceil(product.variantPrice * EURcurrency * shopifyConversionFee)) :
                                      null
                                    }</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">{product.variantTitle}</p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="shadow-md rounded-lg inline-block mt-2 xxs:w-[111px] xs:!w-[130.4px]">
                                      <button 
                                      onClick={() => decrement(product.id)}
                                      className='highlight-removal transition-all ease-in-out duration-100 px-3 rounded-l-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
                                        &mdash;
                                      </button>
                                          <input id="mobile_quantity_input" inputMode='numeric' pattern="[0-9]*" onFocus={(e) => e.target.value = ""} onBlur={(e) => e.target.value = product.variantQuantity} className="transition-all ease-in-out duration-100 relative z-50 focus:outline-2 outline-blue-400 caret-indigo-400 text-center rounded-none xxs:w-9 xs:!w-14 py-1 font-semibold" type="text" value={product.variantQuantity} onChange={(e) => handleChange(product.id, e.target.value)} />
                                      <button 
                                      onClick={() => increment(product.id)}
                                      className='highlight-removal transition-all ease-in-out duration-100 px-3 rounded-r-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
                                        &#xff0b;
                                      </button>  
                                </div>   
                                  <div className="flex">
                                    <button 
                                    onClick={() => {
                                      removeCartItem(product.id);
                                      updateState(product.id);
                                    }}
                                    type="button" 
                                    className="font-medium text-gray-500 hover:text-gray-800">
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul> : 
                        <div>
                            <p>Nothing in your Cart!</p>
                        </div>
                          }
                        
                      </div>
                    </div>
                  </div>
                  {
                      cart.length > 0 ? 
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{
                          currency === '' ? formatter.format(cartTotal) :
                          currency === 'USD' ? formatter.format(cartTotal) :
                          currency === 'GBP' ? GBPFormatter.format(cartTotal) :
                          currency === 'EUR' ? EURFormatter.format(cartTotal) :
                          null
                        }</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <a
                        href={checkoutUrl}
                        className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="font-medium hover:text-gray-800"
                          onClick={() => setCartOpen(false)}
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div> : null
                  }
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
