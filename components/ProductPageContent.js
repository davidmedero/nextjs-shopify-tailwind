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
import { useRouter } from 'next/router'


const fetcher = url => axios.get(url).then(res => res.data)


export default function ProductPageContent({ product, allProducts }) {

  const router = useRouter()

  const { mutate } = useSWRConfig()

  const { data: session } = useSession()
  const email = session?.user.email

  const [showSignInModal, setShowSignInModal] = useState(false)

  const variantImagesArray = []

  const noVariantsArray = []

  const [variantImages, setVariantImages] = useState([])

  variantImages.map((el, i) => {
    variantImagesArray.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={el.image} width='600' height='960' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  product.images.edges.map((image, i) => {
    noVariantsArray.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image.node.originalSrc} width='600' height='960' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  SwiperCore.use([Navigation, Pagination])

  const [imageIndex, setImageIndex] = useState(0)

  const [mousePosition, setMousePosition] = useState({
    backgroundImage: `url(${[variantImages[imageIndex]].map(el => el?.image)})`,
    backgroundPosition: '0% 0%'
  })

  const findImage = (e) => {
    setImageIndex(variantImages.findIndex(el => el.id === JSON.parse(e.target.dataset.info).id))
  }

  useEffect(() => {
    const src = [variantImages[imageIndex]].map(el => el?.image)
    setMousePosition({ backgroundImage: `url(${src})` })
  }, [imageIndex, variantImages]); 

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    setMousePosition({ ...mousePosition, backgroundPosition: `${x}% ${y}%` })
  }

  const [noVariantsImageIndex, setNoVariantsImageIndex] = useState(0)

  const [noVariantsMousePosition, setNoVariantsMousePosition] = useState({
    backgroundImage: `url(${[product.images.edges[noVariantsImageIndex]].map(image => image.node.originalSrc)})`,
    backgroundPosition: '0% 0%'
  })

  const findImageNoVariants = (e) => {
    setNoVariantsImageIndex(product.images.edges.findIndex(el => el.node.id === JSON.parse(e.target.dataset.info).id))
  }

  useEffect(() => {
    const src = [product.images.edges[noVariantsImageIndex]].map(image => image.node.originalSrc)
    setNoVariantsMousePosition({ backgroundImage: `url(${src})` })
  }, [noVariantsImageIndex]); 

  const handleMouseMoveNoVariants = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.pageX - left) / width * 100
    const y = (e.pageY - top) / height * 100
    setNoVariantsMousePosition({ ...noVariantsMousePosition, backgroundPosition: `${x}% ${y}%` })
  }

  useEffect(() => {
    const newArray = []
    product.variants.edges.map(el => {
      const url = new URL(window.location)

      if ((url.searchParams.get('color') === (el.node.selectedOptions[0].value)) && (![...new Set(newArray.map(el => el.id))].includes(el.node.image.id))) {
        newArray.push({image: el.node.image.originalSrc, id: el.node.image.id})
      }
    }).filter(el => el !== undefined)

    setVariantImages(newArray.slice(1, newArray.length))

    const src = variantImages[imageIndex]?.image
    setMousePosition({ backgroundImage: `url(${src})` })
  }, [])

  useEffect(() => {
    window.addEventListener('color', () => {
      const newArray = []
      product.variants.edges.map(el => {
        const url = new URL(window.location)

        if ((url.searchParams.get('color') === (el.node.selectedOptions[0].value)) && (![...new Set(newArray.map(el => el.id))].includes(el.node.image.id))) {
          newArray.push({image: el.node.image.originalSrc, id: el.node.image.id})
        }
      }).filter(el => el !== undefined)

      setVariantImages(newArray.slice(1, newArray.length))

      setImageIndex(0)

      const src = variantImages[imageIndex]?.image
      setMousePosition({ backgroundImage: `url(${src})` })
    })
  }, [])

  const [heartFill, setHeartFill] = useState(false)

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const [added, setAdded] = useState(false)

  const updateMacros = async () => {
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
          variantImages.length !== 0 ? (
            variantImages.map(el => (
              <div
              className="mb-6">
                <Image 
                src={el.image} 
                data-info={JSON.stringify(el)}
                onMouseOver={(e) => findImage(e)}
                width='200' height='300' layout="responsive" objectFit="cover" />
              </div>
            ))
          ) : (
            product.images.edges.map(image => (
              <div
              className="mb-6">
                <Image 
                src={image.node.originalSrc} 
                data-info={JSON.stringify(image.node)}
                onMouseOver={(e) => findImageNoVariants(e)}
                width='200' height='300' layout="responsive" objectFit="cover" />
              </div>
            ))
          )
            
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
              className="absolute right-[8px] top-[6px] z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
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
              className="absolute right-[8px] top-[6px] z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            {
              variantImages.length !== 0 ? (
                [variantImages[imageIndex]].map(el => (
                  el &&
                    <div>
                      {
                        <figure 
                        className="w-full block bg-no-repeat cursor-move"
                        onMouseMove={(e) => handleMouseMove(e)} 
                        style={mousePosition}>
                          <Image 
                          className="opacity-100 hover:opacity-0 transition-all ease-in-out duration-500" 
                          src={el.image} 
                          width='500' height='800' layout="responsive" objectFit="cover" />
                        </figure>
                      }
                      </div>
                  ))
              ) : (
                [product.images.edges[noVariantsImageIndex]].map(image => (
                    <div>
                      {
                        <figure 
                        className="w-full block bg-no-repeat cursor-move"
                        onMouseMove={(e) => handleMouseMoveNoVariants(e)} 
                        style={noVariantsMousePosition}>
                          <Image 
                          className="opacity-100 hover:opacity-0 transition-all ease-in-out duration-500" 
                          src={image.node.originalSrc} 
                          width='500' height='800' layout="responsive" objectFit="cover" />
                        </figure>
                      }
                      </div>
                  ))
              )
            
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
              className="absolute xxs:right-[10px] md:right-[8px] xxs:top-[7px] md:top-[6px] z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="xxs:h-9 xxs:w-9 md:h-8 md:w-8 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
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
              className="absolute xxs:right-[10px] md:right-[8px] xxs:top-[7px] md:top-[6px] z-[10]">
                <svg xmlns="http://www.w3.org/2000/svg" class="xxs:h-9 xxs:w-9 md:h-8 md:w-8 cursor-pointer" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
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
            {variantImagesArray.length === 0 ? noVariantsArray : variantImagesArray}
          </Swiper>
        </div>
        <ProductForm product={product} allProducts={allProducts} />
      </div>
      <RecommendedList current={product.id} products={product.collections.edges[0].node.products.edges} />
    </div>
  )
}
