import Image from 'next/image'
import ProductForm from './ProductForm'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import RecommendedList from './RecommendedList'
import { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react"
import SignInModal from "./SignInModal"
import { useSession } from "next-auth/react"
import useSWR, { useSWRConfig } from "swr"
import axios from "axios"


const fetcher = url => axios.get(url).then(res => res.data)


export default function ProductPageContent({ product }) {

  const { mutate } = useSWRConfig()

  const { data: session } = useSession()
  const email = session?.user.email

  const [showSignInModal, setShowSignInModal] = useState(false)

  const images = []

  product.images.edges.map((image, i) => {
    images.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image.node.originalSrc} atl={image.node.altText} width='600' height='850' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  SwiperCore.use([Navigation, Pagination])

  const [imageIndex, setImageIndex] = useState(0)

  const [mousePosition, setMousePosition] = useState({
    backgroundImage: `url(${[product.images.edges[imageIndex]].map(image => image.node.originalSrc)})`,
    backgroundPosition: '0% 0%'
  })

  const findImage = (e) => {
    setImageIndex(product.images.edges.findIndex(el => el.node.id === JSON.parse(e.target.dataset.info).id))
  }

  useEffect(() => {
    const src = [product.images.edges[imageIndex]].map(image => image.node.originalSrc)
    setMousePosition({ backgroundImage: `url(${src})` })
  }, [imageIndex]); 

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    setMousePosition({ ...mousePosition, backgroundPosition: `${x}% ${y}%` })
  }

  const [heartFill, setHeartFill] = useState(false)

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Button Click');
  }, []);

  const [added, setAdded] = useState(false)

  const updateMacros = async () => {
    console.log('yes')
    if (added) {
      await fetch("https://nextjs-shopify-tailwind-wine.vercel.app/api/wishlist-endpoint", {
        method: 'delete',
        body: JSON.stringify(product.handle)
      })
    } else {
      await fetch("https://nextjs-shopify-tailwind-wine.vercel.app/api/wishlist-endpoint", {
        method: 'post',
        body: JSON.stringify(product.handle)
      })
    }
    mutate('/api/wishlist-endpoint')
  }

  const { data, error } = useSWR('/api/wishlist-endpoint', fetcher)

  const savedItems = data && data.map(el => {
    if (el.email === email) {
      return el.saved_items
    }
  }).filter(el => el != undefined)

  useEffect(() => {
    console.log(savedItems)
    if (savedItems) {
      if (savedItems[0]) {
        if (savedItems[0].includes(product.handle)) {
          setAdded(true)
        } else {
          setAdded(false)
        }
      }
    }
  }, [savedItems])

  return (
    <div>
      <div className="flex flex-col justify-center items-center md:pb-6 md:flex-row md:items-start lg:space-x-6 md:max-w-[1080px] mx-auto">
      <div className="xxs:hidden lg:block w-[8.35%]">
        {
            product.images.edges.map(image => (
              <div
              className="mb-6">
                <Image 
                src={image.node.originalSrc} 
                atl={image.node.altText} 
                data-info={JSON.stringify(image.node)}
                onMouseOver={(e) => findImage(e)}
                width='200' height='300' layout="responsive" objectFit="cover" />
              </div>
            ))
          }
          </div>
          <div className="relative xxs:hidden lg:block w-[40%]">
          {session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros()
              }}
              className="absolute right-[6px] top-1 z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {!session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                setShowSignInModal(true)
              }}
              className="absolute right-[6px] top-1 z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {
              [product.images.edges[imageIndex]].map(image => (
                <div>
                  {
                    <figure 
                    className="w-full block bg-no-repeat cursor-move"
                    onMouseMove={(e) => handleMouseMove(e)} 
                    style={mousePosition}>
                      <Image 
                      className="opacity-100 hover:opacity-0 transition-all ease-in-out duration-500" 
                      src={image.node.originalSrc} 
                      width='600' height='850' layout="responsive" objectFit="cover" />
                    </figure>
                  }
                  </div>
              ))
            }
          </div>
        <div className="relative lg:hidden w-full flex justify-center md:mr-[calc(15%-100px)] md:max-w-[432px] bg-white">
        {session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros()
              }}
              className="absolute right-[6px] top-1 z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {!session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                setShowSignInModal(true)
              }}
              className="absolute right-[6px] top-1 z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
            </SignInModal>
            <Swiper
            style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
            navigation={true}
            pagination={{ clickable: true }}
            className="w-full"
            loop='true'
          >
            {images}
          </Swiper>
        </div>
        <ProductForm product={product} />
      </div>
      <RecommendedList current={product.id} products={product.collections.edges[0].node.products.edges} />
    </div>
  )
}
