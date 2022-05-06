import Link from 'next/link'
import { useContext, useEffect, useState, useRef } from 'react'
import { CartContext } from '../context/shopContext'
import Cart from './Cart'
import SignInButton from './SignInButton'
import collections from '../categories'
import MobileMenuButton from './MobileMenuButton'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import CurrencyConversion from './CurrencyConversion'
import Head from 'next/head'


export default function Nav() {

  const ref = useRef()

  const myRefname= useRef(null);

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

  const [isOpen, setIsOpen] = useState(false)

  function toggleMenu() {
    setShowMenu(checked => !checked);
  }

  console.log(inputState)

  useEffect(() => {
    function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowMenu(true)
      setIsOpen(false);
    }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

  const handleFocus = () => {
    setIsOpen(true);
    !isOpen ? myRefname.current.focus() : setIsOpen(false);
 }


  return (
    <header className='border-b sticky top-0 z-20 bg-white shadow-md'>
      <Head>
      <script type='text/javascript'>
        {
          `
          const input = document.getElementById("search-input");
          const searchBtn = document.getElementById("search-btn");

          const expand = () => {
            searchBtn.classList.toggle("close");
            input.classList.toggle("square");
          };

          searchBtn.addEventListener("click", expand);

          document.addEventListener('click', function(event) {
            let isClickInside1 = input.contains(event.target);
            let isClickInside2 = searchBtn.contains(event.target);

            if (!isClickInside1 && !isClickInside2) {
              input.classList.remove("square")
              searchBtn.classList.remove("close");
            }
          });
        `
        }
      </script>
      </Head>
        <div className='flex items-center justify-between max-w-6xl py-4 px-8 mx-auto lg:max-w-screen-xl'>
            <div className="xxs:flex lg:!hidden">
            <MobileMenuButton />
            </div>
            <Link href="/" passHref>
                <a className='cursor-pointer xxs:hidden lg:!block'>
                    <span className='text-2xl pt-1 font-bold'>
                        Logo
                    </span>
                </a>
            </Link>
            <Link href="/" passHref>
                <a className='cursor-pointer xxs:block lg:!hidden'>
                    <span className='text-2xl pt-1 font-bold'>
                      <span className={ (showMenu ? ('opacity-100 transition-all duration-700 ease-in-out visible') : ('opacity-0 transition-all duration-300 ease-in-out invisible')) }>
                        Logo
                      </span>
                    </span>
                </a>
            </Link>
            <div className='xxs:hidden lg:!block'>
              <div className={ (showMenu ? ('opacity-100 transition-all duration-700 ease-in-out visible') : ('opacity-0 transition-all duration-300 ease-in-out invisible')) } >
              {
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
              }
              </div>
            </div>
            <div className='flex items-center justify-end relative'>
            <form 
            ref={ref}
            onClick={() => {
              toggleMenu();
              handleFocus();
              }} 
              id="search_content" 
              autocomplete="off">
                <input 
                ref={myRefname} 
                onClick={() => {
                  setShowMenu(!showMenu);
                  setIsOpen(true);
                  }} 
                  onChange={(e) => setInputState(e.target.value)} type="text" name="input" class="search_input" id="search-input" />
                  <button type="reset" class="search_button" id="search-btn"></button>
            </form>
            <SignInButton />
            <a 
            className='text-lg font-bold cursor-pointer'
            onClick={() => setCartOpen(!cartOpen)}
            >
                Cart {cartQuantity > 0 ? '(' + cartQuantity + ')' : ''}
            </a>
            <Cart cart={cart} />
            <CurrencyConversion />
            </div>
        </div>
        {
          showSubMenu && (
          <div
          onMouseEnter={() => setShowSubMenu(true)}
          onMouseLeave={() => setShowSubMenu(false)}
          className="absolute pb-6 w-full flex flex-col justify-center shadow-md border-b bg-white">
              <SlideDown className={'my-dropdown-slidedown'}>
              {
            <div className="flex justify-center bg-white">
              {subcategories[categoryIndex].map(subcategory => (
                <div onClick={() => setShowSubMenu(false)}>
                    {
                    subcategory.handle === "" ? (
                        <div className="relative right-5">
                        <div className='font-semibold flex p-6 pointer-events-none hover:bg-pink-100'>
                            {subcategory.title}
                        </div>
                        </div>
                    ) : 
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle}>
                        <div className="relative right-5">
                            <a className='font-semibold flex p-6 cursor-pointer hover:bg-pink-100'>
                                {subcategory.title}
                            </a>
                        </div>
                    </Link>)
                    }
                  {subcategory.sub_subcollections?.map(sub_subcategory => (
                      subcategory.handle === "" ? (
                        <Link href={'/' + categoryHandle + '/' + sub_subcategory.handle}>
                        <div className="relative right-5">
                          <a className='flex py-1 px-6 cursor-pointer hover:bg-pink-100'>
                            {sub_subcategory.title}
                          </a>
                       </div>
                    </Link> 
                      ) :
                    (<Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                        <div className="relative right-5">
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
    </header>
  )
}
