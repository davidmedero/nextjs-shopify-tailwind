import Link from 'next/link'
import { useContext, useEffect, useState, useRef } from 'react'
import { CartContext } from '../context/shopContext'
import Cart from './Cart'
import SignInButton from './SignInButton'
import collections from '../categories'
import MobileMenuButton from './MobileMenuButton'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { useRouter } from 'next/router'
import CurrencyConversion from './CurrencyConversion'
import { isChrome, isIPhone13, isIPad13, isMobile } from 'react-device-detect'


export default function Nav() {

  const router = useRouter()

  const ref = useRef()

  const inputRef = useRef()

  const mobileInputRef = useRef()

  const focusRef = useRef()

  const { cart, cartOpen, setCartOpen } = useContext(CartContext)

  let cartQuantity = 0
  cart.map(item => {
      return (cartQuantity += item?.variantQuantity)
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


  return (
    <header className='border-b sticky top-0 z-20 bg-white shadow-md'>
        <div className={(showMenu ? 'flex items-center justify-between max-w-6xl py-4 px-8 mx-auto lg:max-w-screen-xl transition-all duration-300 ease-in-out' : 'flex items-center justify-between max-w-6xl py-4 px-8 mx-auto lg:max-w-screen-xl xxs:pb-20 lg:pb-4 transition-all duration-300 ease-in-out')}>
            <div className="xxs:flex lg:!hidden">
            <MobileMenuButton />
            </div>
            <Link href="/" passHref>
                <a className='cursor-pointer'>
                    <span className='text-2xl pt-1 font-bold'>
                        Logo
                    </span>
                </a>
            </Link>
            <div className='xxs:hidden lg:!block'>
              <div>
              {
                showMenu && (
                  collections.map(collection => (
                      collection.handle == "shop" ?
                      (<Link href={'/shop-brands'} >
                      <a className="p-6 hover:bg-pink-100"
                      data-info={JSON.stringify(collection)}
                      onMouseEnter={(e) => {
                          setShowSubMenu(true);
                          findCategory(e);
                          getCategoryHandle(e);
                          }}
                          onMouseLeave={() => setShowSubMenu(false)}
                          onClick ={() => setShowSubMenu(false)}>
                          {collection.title}
                      </a>
                      </Link>) :
                      (<Link href={'/' + collection.handle} >
                          <a className="p-6 hover:bg-pink-100"
                          data-info={JSON.stringify(collection)}
                          onMouseEnter={(e) => {
                              setShowSubMenu(true);
                              findCategory(e);
                              getCategoryHandle(e);
                              }}
                              onMouseLeave={() => setShowSubMenu(false)}
                              onClick ={() => setShowSubMenu(false)}>
                              {collection.title}
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
                  id='input' type="text" placeholder="Search..." name="input" className="border-b border-black w-[500px]" />
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  </div>
                ) : (
                  <div className='hidden'>
                  <input />
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  </div>
                )
              }
               
              </div>
            </div>
            <div className='flex items-center relative'>
              <div 
              className='relative right-5 hover:scale-[1.3] transition-all duration-200 ease-in-out'
              ref={ref}
              onClick={() => {
                toggleMenu();
                }} >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
            <SignInButton />
            <a 
            id='slide-toggle'
            className='cursor-pointer flex justify-center items-center'
            onClick={() => setCartOpen(!cartOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 hover:scale-[1.2] transition-all duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke={cartQuantity > 0 ? '#ff00a7' : "currentColor"} stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg> 
                <span className='absolute z-[-1] top-[12px] text-[12px] text-[#ff00a7] font-semibold select-none'>{cartQuantity > 0 ? cartQuantity : ''}</span>
            </a>
            <Cart cart={cart} />
            <CurrencyConversion />
            </div>
        </div>
        <div className={!showMenu ? 'xxs:opacity-100 lg:hidden xxs:transition-opacity xxs:ease-in-out xxs:duration-700' : 'xxs:opacity-0'}>
        <div className='xxs:absolute xxs:top-20 xxs:left-[48%] xxs:-translate-x-1/2 lg:hidden '>
          {
          !showMenu && (
                  <div className='xxs:flex xxs:rounded-none'>
                    <input
                    onChange={(e) => setQuery(e.target.value)}
                    ref={mobileInputRef}
                    autoComplete='off'
                    autoFocus
                    id="mobile-input" type="text" placeholder="Search..." className="xxs:border-b-black xxs:border-b xxs:w-[80vw] md:w-[60vw] xxs:rounded-none" />
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>)
                  }
              </div>
              </div>
              <div className="absolute w-full flex flex-col justify-center bg-white">
              <SlideDown className={'my-dropdown-slidedown'}>
        {
          showSubMenu && (
          <div
          onMouseEnter={() => setShowSubMenu(true)}
          onMouseLeave={() => setShowSubMenu(false)}
          className="relative pb-6 w-full flex flex-col justify-center shadow-md border-b bg-white">
              <SlideDown className={'my-dropdown-slidedown'}>
              {
            <div className="flex justify-center bg-white">
              {subcategories[categoryIndex].map(subcategory => (
                <div>
                    {
                    subcategory.handle === "" ? (
                        <div className="relative right-5">
                        <div className='font-semibold flex p-6 pointer-events-none hover:bg-pink-100'>
                            {subcategory.title}
                        </div>
                        </div>
                    ) : 
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative right-5">
                            <a className='font-semibold flex p-6 cursor-pointer hover:bg-pink-100'>
                                {subcategory.title}
                            </a>
                        </div>
                    </Link>)
                    }
                  {subcategory.sub_subcollections?.map(sub_subcategory => (
                      subcategory.handle === "" ? (
                        <Link href={'/' + categoryHandle + '/' + sub_subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative right-5">
                          <a className='flex py-1 px-6 cursor-pointer hover:bg-pink-100'>
                            {sub_subcategory.title}
                          </a>
                       </div>
                    </Link> 
                      ) :
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                        <div onClick={() => setShowSubMenu(false)} className="relative right-5">
                          <a className='flex py-1 px-6 cursor-pointer hover:bg-pink-100'>
                            {sub_subcategory.title}
                          </a>
                       </div>
                    </Link>)
                  ))}
                </div>
              ))}
            </div>
              }
              </SlideDown>
          </div>
          )
        }
        </SlideDown>
        </div>
    </header>
  )
}
