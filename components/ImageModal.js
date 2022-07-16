import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { useEffect, useState, useCallback, useRef, Fragment } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'


export default function ImageModal({ show, onClose, product }) {
    const cancelButtonRef = useRef()

    const handlers = useSwipeable({
      onSwipedUp: () => onClose(),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
    })

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //       if (cancelButtonRef.current && !cancelButtonRef.current.contains(event.target) && (event.target !== document.getElementById('enlargeImage')) && (event.target !== document.getElementById('enlargeImage2')) && (event.target !== document.getElementById('enlargeImage3')) ) {
    //         onClose()
    //       }
    //       }
    //       document.addEventListener("mousedown", handleClickOutside);
    //       return () => {
    //       document.removeEventListener("mousedown", handleClickOutside);
    //     };
    //   }, [cancelButtonRef])

  const variantImagesArray = []

  const noVariantsArray = []

  const variantImageRef = useRef()
  const [variantImages, setVariantImages] = useState([])
  variantImageRef.current = variantImages

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

  const imageColumn = useRef()

  useEffect(() => {
    function handleClickOutside(event) {
        if (cancelButtonRef.current && !cancelButtonRef.current.contains(event.target) && event.target !== document.getElementById("enlargeImage") && event.target !== document.getElementById("enlargeImage2") && event.target !== document.getElementById("enlargeImage3") && !imageColumn.current.contains(event.target)) {
            onClose()
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [cancelButtonRef]);

  const SCROLL_BOX_MIN_HEIGHT = 20;
  const [hovering, setHovering] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const scrollHostRef = useRef();
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);

  const handleMouseOver = useCallback(() => {
    !hovering && (variantImageRef.current.length > 4 || (variantImages.length === 0 && product.images.edges.length > 4)) && setHovering(true);
  }, [hovering]);

  const handleMouseOut = useCallback(() => {
    !!hovering && setHovering(false);
  }, [hovering]);

  const handleDocumentMouseUp = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseMove = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = scrollHostRef.current;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        let deltaY = e.clientY - lastScrollThumbPosition;
        let percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight
          )
        );
        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        );
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const handleScrollThumbMouseDown = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
    console.log("handleScrollThumbMouseDown");
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) {
      return;
    }
    const scrollHostElement = scrollHostRef.current;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight;

    // newTop = newTop + parseInt(scrollTop, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, []);

  useEffect(() => {
    if (scrollHostRef.current && scrollHostRef.current.clientHeight) {
        const scrollHostElement = scrollHostRef.current;
        const { clientHeight, scrollHeight } = scrollHostElement;
        const scrollBoxPercentage = clientHeight / scrollHeight;
        const scrollbarHeight = Math.max(
          scrollBoxPercentage * clientHeight,
          SCROLL_BOX_MIN_HEIGHT
        );
        setScrollBoxHeight(scrollbarHeight);
        scrollHostElement.addEventListener("scroll", handleScroll, true);
        return function cleanup() {
          scrollHostElement.removeEventListener("scroll", handleScroll, true);
        };
    }
  }, [scrollBoxTop, hovering]);

  useEffect(() => {
    //this is handle the dragging on scroll-thumb
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mouseleave", handleDocumentMouseUp);
    return function cleanup() {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mouseleave", handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);


    return (
         <Transition.Root show={show} as={Fragment} {...handlers}>
    <Dialog 
    {...handlers}
    initialFocus={cancelButtonRef}
    as="div" 
    className="fixed z-[9998] inset-0 overflow-y-scroll " 
    onClose={onClose}>
      <div {...handlers} className="absolute inset-0">
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
          <Dialog.Overlay {...handlers} className="absolute inset-0 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div {...handlers} className="mx-auto inset-y-0 max-w-full flex justify-center">
          <Transition.Child
          {...handlers}
            as={Fragment}
            enter="transform transition ease-in-out duration-500"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-500"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
      <div>
      <div className="w-screen bg-black bg-opacity-75">
          <div className="flex justify-end p-2 sticky top-0">
              <button ref={cancelButtonRef} onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white outline-black">
                  <svg className="w-7 h-7 highlight-removal outline-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
              </button>
          </div>
          <div>
      <div  className="flex flex-col justify-center items-start md:flex-row md:items-start lg:space-x-6 md:max-w-[1080px] mx-auto -mt-[56px]">
      <div
      ref={imageColumn}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={`scrollhost-container xxs:hidden lg:block w-[8.35%] cursor-pointer h-[613px] z-10`}>
        <div
        ref={scrollHostRef}
        className={`scrollhost max-h-full`}>
        {
          variantImages.length !== 0 ? (
            variantImages.map(el => (
              <div
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
          <div class='enlargeImage' className="relative xxs:hidden lg:block w-full max-w-screen-md">
            {
              variantImages.length !== 0 ? (
                [variantImages[imageIndex]].map(el => (
                  el &&
                    <div>
                      {
                        <figure 
                        className="w-full block bg-cover bg-no-repeat cursor-pointer">
                          <Image 
                          id='enlargeImage'
                          onClick={()=> window.open(`${el.image}`, "_blank")} 
                          className="" 
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
                        className="w-full block bg-no-repeat cursor-pointer">
                          <Image 
                          id='enlargeImage2'
                          className="" 
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
        </div>
        </div>
        </div>
      </div>
      </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
    )
}