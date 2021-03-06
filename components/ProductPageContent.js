import Image from 'next/image'
import ProductForm from './ProductForm'
import RecommendedList from './RecommendedList'
import { useEffect, useState, useCallback, useRef } from "react"
import GetTheLook from './GetTheLook'
import ImageModal from './ImageModal'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'


export default function ProductPageContent({ product, allProducts }) {

  const [showImageModal, setShowImageModal] = useState(false)

  const variantImagesArray = []

  const noVariantsArray = []

  const variantImageRef = useRef()
  const [variantImages, setVariantImages] = useState([])
  variantImageRef.current = variantImages

  variantImages.map((el, i) => {
    variantImagesArray.push(
      <Image src={el.image} width='417' height='627' layout="responsive" objectFit="contain" />
    )
  })

  product.images.edges.map((image, i) => {
    noVariantsArray.push(
      <Image src={image.node.originalSrc} width='417' height='627' layout="responsive" objectFit="contain" />
    )
  })

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
  }, [imageIndex, variantImages])

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

  const SCROLL_BOX_MIN_HEIGHT = 20
  const [hovering, setHovering] = useState(false)
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT)
  const [scrollBoxTop, setScrollBoxTop] = useState(0)
  const scrollHostRef = useRef()
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0)
  const [isDragging, setDragging] = useState(false)

  const handleMouseOver = useCallback(() => {
    !hovering && (variantImageRef.current.length > 4 || (variantImages.length === 0 && product.images.edges.length > 4)) && setHovering(true);
  }, [hovering])

  const handleMouseOut = useCallback(() => {
    !!hovering && setHovering(false);
  }, [hovering])

  const handleDocumentMouseUp = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  )

  const handleDocumentMouseMove = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation()
        const scrollHostElement = scrollHostRef.current
        const { scrollHeight, offsetHeight } = scrollHostElement

        let deltaY = e.clientY - lastScrollThumbPosition
        let percentage = deltaY * (scrollHeight / offsetHeight)

        setScrollThumbPosition(e.clientY)
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight
          )
        )
        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        )
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  )

  const handleScrollThumbMouseDown = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    setScrollThumbPosition(e.clientY)
    setDragging(true)
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) {
      return
    }
    const scrollHostElement = scrollHostRef.current
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight

    // newTop = newTop + parseInt(scrollTop, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight)
    setScrollBoxTop(newTop)
  }, [])

  useEffect(() => {
    const scrollHostElement = scrollHostRef.current
    const { clientHeight, scrollHeight } = scrollHostElement
    const scrollBoxPercentage = clientHeight / scrollHeight
    const scrollbarHeight = Math.max(
      scrollBoxPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT
    )
    setScrollBoxHeight(scrollbarHeight)
    scrollHostElement.addEventListener("scroll", handleScroll, true)
    return function cleanup() {
      scrollHostElement.removeEventListener("scroll", handleScroll, true)
    }
  }, [scrollBoxTop, hovering])

  useEffect(() => {
    //this is handle the dragging on scroll-thumb
    document.addEventListener("mousemove", handleDocumentMouseMove)
    document.addEventListener("mouseup", handleDocumentMouseUp)
    document.addEventListener("mouseleave", handleDocumentMouseUp)
    return function cleanup() {
      document.removeEventListener("mousemove", handleDocumentMouseMove)
      document.removeEventListener("mouseup", handleDocumentMouseUp)
      document.removeEventListener("mouseleave", handleDocumentMouseUp)
    }
  }, [handleDocumentMouseMove, handleDocumentMouseUp])

  const [showGTL, setShowGTL] = useState(true)
  const [showYMAL, setShowYMAL] = useState(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [ref, instanceRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 0px)": {
        slides: { perView: 1.4 }
      },
      "(min-width: 500px)": {
        slides: { perView: 1.5 }
      },
      "(min-width: 600px)": {
        slides: { perView: 1.9 }
      },
      "(min-width: 768px)": {
        slides: { perView: 1.4 }
      }
    },
    mode: "free-snap",
    loop: false,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true);
    }
  })

  useEffect(() => {
   instanceRef?.current?.update()
    }, [variantImages, instanceRef])

  


  return (
    <div>
      <div className="flex flex-col justify-center md:pb-6 md:flex-row md:items-start lg:space-x-6 lg:max-w-[960px] mx-auto relative xxs:overflow-hidden md:!overflow-visible">
      <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={`scrollhost-container xxs:hidden lg:block w-[90.2px] cursor-pointer h-[613px] z-10 !top-[62px]`}>
        <div 
        ref={scrollHostRef}
        className={`scrollhost max-h-full`}>
        {
          variantImages.length !== 0 ? (
            variantImages.map(el => (
              <div
              key={el.id}
              className="mb-6 last:mb-0">
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
              key={image.node.id}
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
      <div className={"scroll-bar2 transition-all ease-in-out duration-200"} style={{ opacity: hovering ? 1 : 0 }}>
        <div
          className={(variantImageRef.current.length > 4 || (variantImages.length === 0 && product.images.edges.length > 4)) && "scroll-thumb2"}
          style={{ height: scrollBoxHeight - 8, top: scrollBoxTop }}
          onMouseDown={handleScrollThumbMouseDown}
        />
      </div>
    </div>
          <div className="sticky !top-[62px] xxs:hidden lg:block w-[40%]">
            {
              variantImages.length !== 0 ? (
                [variantImages[imageIndex]].map(el => (
                  el &&
                    <div key={el.id}>
                      {
                        <figure 
                        className="w-[383px] block bg-no-repeat cursor-zoom-in"
                        onMouseMove={(e) => handleMouseMove(e)} 
                        style={mousePosition}>
                          <Image 
                          onClick={() => setShowImageModal(true)}
                          className="opacity-100 hover:opacity-0 transition-all ease-in-out duration-500" 
                          src={el.image} 
                          width='500' height='800' layout="responsive" objectFit="cover" />
                        </figure>
                      }
                      </div>
                  ))
              ) : (
                [product.images.edges[noVariantsImageIndex]].map(image => (
                    <div key={image.node.id}>
                      {
                        <figure 
                        className="w-full block bg-no-repeat cursor-zoom-in"
                        onMouseMove={(e) => handleMouseMoveNoVariants(e)} 
                        style={noVariantsMousePosition}>
                          <Image 
                          onClick={() => setShowImageModal(true)}
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
          <ImageModal show={showImageModal} onClose={() => setShowImageModal(false)} product={product} />
            <div 
        className="xxs:sticky md:top-[64px] xxs:max-w-full md:min-w-[55.7%] md:max-w-[55.7%] lg:hidden flex justify-center bg-white cursor-zoom-in">
            <div ref={ref} className="keen-slider">
              { variantImagesArray.length === 0 ? (
                product.images.edges.map((image, i) => {
                  return (<div key={i} onClick={() => setShowImageModal(true)} className="keen-slider__slide">
                    <Image src={image.node.originalSrc} width='417' height='627' layout="responsive" objectFit="contain" />
                  </div>)
                })
              ) : (
                variantImages.map((el, idx) => (
                  <div key={idx} onClick={() => setShowImageModal(true)} className="keen-slider__slide">
                    <Image src={el.image} width='417' height='627' layout="responsive" objectFit="contain" />
                  </div>
                ))
              )
              }
            </div>
            {loaded && instanceRef.current && (
              <div className="dots absolute bottom-0">
                {[
                  ...Array(instanceRef?.current?.track?.details?.slides.length).keys(),
                ].map((idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        instanceRef.current?.moveToIdx(idx)
                      }}
                      className={"dot" + (currentSlide === idx ? " active" : "")}
                    ></button>
                  )
                })}
              </div>
            )}
            </div>
        <ProductForm product={product} allProducts={allProducts} variantImages={variantImages} />
      </div>
      <div className='mx-8 mt-3'>
        <div className="text-2xl relative text-center flex flex-row justify-around mx-auto text-white max-w-[1220px] cursor-pointer mb-4">
          <div 
          onMouseOver={() => {setShowGTL(true), setShowYMAL(false)}}
          className={`rounded-md w-full h-full py-5 font-semibold hover:text-[#ff00a7] ${showGTL ? "border-l border-r border-t rounded-b-none" : "border-l-0 border-t-0 border-b bg-gray-900 rounded-tl-md rounded-b-none"}`}>GET THE LOOK</div>
          <div 
          onMouseOver={() => {setShowGTL(false), setShowYMAL(true)}}
          className={`rounded-md w-full h-full py-5 font-semibold hover:text-[#ff00a7] ${showYMAL ? "border-l border-r border-t rounded-b-none" : "border-r-0 border-t-0 border-b bg-gray-900 rounded-tr-md rounded-b-none"}`}>YOU MAY ALSO LIKE</div>
        </div>
      </div>
      {
            showGTL ? (
              <GetTheLook product={product} allProducts={allProducts} />
            ) : (
              <RecommendedList product={product} allProducts={allProducts} />
            )
          }
    </div>
  )
}
