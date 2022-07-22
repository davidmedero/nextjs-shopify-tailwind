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

  const increment = (product_id) => {
    let item = cart.find(el => el.id === product_id)
    if (item.variantQuantity < 9) {
      item.variantQuantity += 1
      updateCartQuantity(item)
    }
  }

  const decrement = (product_id) => {
    let item = cart.find(el => el.id === product_id)
    if (item.variantQuantity > 1) {
      item.variantQuantity -= 1
      updateCartQuantity(item)
    }
  }

  const handleChange = (id, e) => {
    let item = cart.find(el => el.id === id)
    item.variantQuantity = Number.parseFloat(e)
    updateCartQuantity(item)
    
    if (isNaN(item.variantQuantity)) {
      item.variantQuantity = 1
    }
  }

  const updateState = (id) => {
    let item = cart.find(el => el.id === id)
    item.variantQuantity = 1
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
            <Dialog.Overlay {...handlers} className="absolute inset-0 bg-black bg-opacity-75 transition-opacity" />
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
                <div className="h-full flex flex-col bg-black shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-white">Shopping Bag</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                        ref={cancelButtonRef}
                          type="button"
                          className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
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
                              <div className="relative shadow-md flex-shrink-0 w-28 h-[166px] border rounded-md overflow-hidden hover:opacity-75">
                              <Link href={`/${product.variantLink}`} passHref>
                                <a onClick={() => setCartOpen(false)}>
                                  {
                                    product.variantImages.length !== 0 ? (
                                      <Image
                                    src={product.variantImages[0]?.image}
                                    alt={product.title}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                    ) : (
                                      <Image
                                    src={product.image}
                                    alt={product.title}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                    )
                                  }
                                </a>
                                </Link>
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-white">
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
                                  <p className="mt-1 text-sm text-white">{product.variantTitle}</p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="rounded-md flex shadow-md flex-row max-w-[150px]">
                                      
                                      <input id="mobile_quantity_input" autoComplete='off' inputMode='numeric' pattern="[0-9]*" onFocus={(e) => e.target.value = ""} onBlur={(e) => e.target.value = product.variantQuantity} className="text-base  border-b border-t border-l bg-black text-white transition-all ease-in-out duration-100 relative focus:outline-2 outline-[#ff00a7] caret-[#ff00a7] w-full xxs:rounded-l-md xxs:rounded-r-none py-[6px] text-center" type="text" value={product.variantQuantity} onChange={(e) => handleChange(product.id, e.target.value)} />
                                      <button 
                                      onClick={() => decrement(product.id)}
                                      className='bg-black border-t border-b border-l text-white highlight-removal transition-all ease-in-out duration-100 px-3 py-[6px] hover:bg-gray-800 active:bg-gray-700 hover:text-white active:text-white'>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                        </svg>
                                      </button>
                                      <button 
                                      onClick={() => increment(product.id)}
                                      className='bg-black border text-white highlight-removal transition-all ease-in-out duration-100 px-3 py-[6px] hover:bg-gray-800 active:bg-gray-700 hover:text-white active:text-white rounded-r-md'>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                        </svg>
                                      </button>  
                                </div>   
                                  <div className="flex">
                                    <button 
                                    onClick={() => {
                                      removeCartItem(product.id);
                                      updateState(product.id);
                                    }}
                                    type="button" 
                                    className="relative bottom-2 xxs:ml-4 font-medium hover:scale-150 transition-transform ">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul> : 
                        <div>
                            <p className='text-white'>Your Bag is Empty!</p>
                        </div>
                          }
                        
                      </div>
                    </div>
                  </div>
                  {
                      cart.length > 0 ? 
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-white">
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
                        className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#ff00a7] hover:bg-[#d4008a] transition-all ease-in-out duration-300"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="font-medium hover:text-white transition-all ease-in-out duration-300"
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
