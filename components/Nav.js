import Link from 'next/link'
import { useContext, useState } from 'react'
import { CartContext } from '../context/shopContext'
import Cart from './Cart'
import SignInButton from './SignInButton'
import collections from '../categories'
import MobileMenuButton from './MobileMenuButton'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'


export default function Nav() {

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


  return (
    <header className='border-b sticky top-0 z-20 bg-white shadow-md'>
        <div className='flex items-center justify-between max-w-6xl py-4 px-8 mx-auto lg:max-w-screen-xl'>
            <div className="xxs:flex md:!hidden">
            <MobileMenuButton />
            </div>
            <Link href="/" passHref>
                <a className='cursor-pointer'>
                    <span className='text-2xl pt-1 font-bold'>
                        Logo
                    </span>
                </a>
            </Link>
            <div className="relative xxs:hidden md:!block">
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
            <div className='flex items-center justify-end'>
            <SignInButton />
            <a 
            className='text-lg font-bold cursor-pointer'
            onClick={() => setCartOpen(!cartOpen)}
            >
                Cart {cartQuantity > 0 ? '(' + cartQuantity + ')' : ''}
            </a>
            <Cart cart={cart} />
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
                    <Link href={'/' + categoryHandle + '/' + subcategory.handle + '/' + sub_subcategory.handle}>
                        <div className="relative right-5">
                          <a className='flex py-1 px-6 cursor-pointer hover:bg-pink-100'>
                            {sub_subcategory.title}
                          </a>
                       </div>
                    </Link>
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
