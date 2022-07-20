import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { useEffect, useState, useCallback, useRef, Fragment } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'


export default function ImageModal({ show, onClose, product }) {

  const cancelButtonRef0 = useRef()

  const cancelButtonRef2 = useRef()

  const handlers = useSwipeable({
    onSwipedUp: () => onClose(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const variantImagesArray = []

  const noVariantsArray = []

  const variantImageRef = useRef()
  const [variantImages, setVariantImages] = useState([])
  variantImageRef.current = variantImages

  variantImages.map((el, i) => {
    variantImagesArray.push(
      <SwiperSlide key={`slide-${i}`}>
        <img src={el.image} onClick={(e) => {e.preventDefault(); e.stopPropagation()}} className="imgModalMobile mx-auto select-none" />
      </SwiperSlide>
    )
  })

  product.images.edges.map((image, i) => {
    noVariantsArray.push(
      <SwiperSlide key={`slide-${i}`}>
        <img src={image.node.originalSrc} onClick={(e) => {e.preventDefault(); e.stopPropagation()}} className="imgModalMobile mx-auto select-none" />
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

  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(false)
  }, [active])

  useEffect(() => {
    function handleClickOutside(event) {
      console.log()
        if (cancelButtonRef0.current && !cancelButtonRef0.current.contains(event.target) && cancelButtonRef2.current && !cancelButtonRef2.current.contains(event.target) && event.target !== document.getElementById("enlargeImage") && event.target !== document.getElementById("enlargeImage2") && event.target !== document.getElementById("enlargeImage3") && !imageColumn.current.contains(event.target) && event.target !== document.getElementById("scrb3") && event.target !== document.getElementById("scrt3") && event.target !== document.querySelector(".modalBlock") && event.target !== document.querySelector(".swiper-button-prev") && event.target !== document.querySelector(".swiper-button-next") && document.querySelectorAll(".swiper-pagination").forEach(el => el !== event.target) && document.querySelectorAll(".swiper-pagination-bullet").forEach(el => el !== event.target)) {
            onClose()
        }
        
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cancelButtonRef0, cancelButtonRef2]);

  const SCROLL_BOX_MIN_HEIGHT = 20;
  const [hovering, setHovering] = useState(false);
  const [hovering2, setHovering2] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxHeight2, setScrollBoxHeight2] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [scrollBoxTop2, setScrollBoxTop2] = useState(0);
  const scrollHostRef = useRef();
  const scrollHostRef2 = useRef();
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
  const [lastScrollThumbPosition2, setScrollThumbPosition2] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [isDragging2, setDragging2] = useState(false);
  const [scrollTop2, setScrollTop2] = useState(0)
  const [scrolling2, setScrolling2] = useState(false)
  const scrollTrackRef = useRef()

  useEffect(() => {
    const div2 = document.querySelector('.scrollhost3')
    const thumb = document.querySelector('.scroll-thumb3')
    const onScroll = () => {
      setScrollTop2(div2.scrollTop2);
      setScrolling2(div2.scrollTop2 > scrollTop2 || div2.scrollTop2 < scrollTop2)
    }
    div2?.addEventListener("scroll", onScroll);

    (function(timer) {
        div2?.addEventListener('scroll', function(e) {
          thumb.classList.add('toggleScrollThumb3')
          clearTimeout(timer)
          timer = setTimeout(function() {
            thumb.classList.remove('toggleScrollThumb3')
          }, 100)
        })
    })()

    return () => {div2?.removeEventListener("scroll", onScroll)}
  }, [scrollTop2, hovering2])

  const handleMouseOver = useCallback(() => {
    !hovering && (variantImageRef.current.length > 4 || (variantImages.length === 0 && product.images.edges.length > 4)) && setHovering(true);
  }, [hovering]);

  const handleMouseOut = useCallback(() => {
    !!hovering && setHovering(false);
  }, [hovering]);

  const handleMouseOver2 = useCallback(() => {
    !hovering2 && (variantImageRef.current.length > 4 || (variantImages.length === 0 && product.images.edges.length > 4)) && setHovering2(true);
  }, [hovering2]);

  const handleMouseOut2 = useCallback(() => {
    !!hovering2 && setHovering2(false);
  }, [hovering2]);

  const handleDocumentMouseUp = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseUp2 = useCallback(
    e => {
      if (isDragging2) {
        e.preventDefault();
        setDragging2(false);
      }
    },
    [isDragging2]
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

  const handleDocumentMouseMove2 = useCallback(
    e => {
      if (isDragging2) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = scrollHostRef2.current;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        let deltaY = e.clientY - lastScrollThumbPosition2;
        let percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition2(e.clientY);
        setScrollBoxTop2(
          Math.min(
            Math.max(0, scrollBoxTop2 + deltaY),
            offsetHeight - scrollBoxHeight2
          )
        );
        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        );
      }
    },
    [isDragging2, lastScrollThumbPosition2, scrollBoxHeight2, scrollBoxTop2]
  );

  const handleScrollThumbMouseDown = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
  }, []);

  const handleScrollThumbMouseDown2 = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition2(e.clientY);
    setDragging2(true);
  }, []);

  const handleTrackClick = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      const { current: trackCurrent } = scrollTrackRef
      const { current: contentCurrent } = scrollHostRef2
      if (trackCurrent && contentCurrent && (e.target !== document.getElementById("scrt3"))) {
        // First, figure out where we clicked
        const { clientY } = e
        // Next, figure out the distance between the top of the track and the top of the viewport
        const target = e.target
        const rect = target.getBoundingClientRect()
        const trackTop = rect.top
        // We want the middle of the thumb to jump to where we clicked, so we subtract half the thumb's height to offset the position
        const thumbOffset = -(scrollBoxHeight2 / 2)
        // Find the ratio of the new position to the total content length using the thumb and track values...
        const clickRatio =
          (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight
        // ...so that you can compute where the content should scroll to.
        const scrollAmount = Math.floor(
          clickRatio * contentCurrent.scrollHeight
        )
        // And finally, scroll to the new position!
        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: 'smooth',
        })
      }
    },
    [scrollBoxHeight2]
  );

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

  const handleScroll2 = useCallback(() => {
    if (!scrollHostRef2) {
      return;
    }
    const scrollHostElement = scrollHostRef2.current;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight;

    // newTop = newTop + parseInt(scrollTop, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight2);
    setScrollBoxTop2(newTop);
  }, []);

  useEffect(() => {
    if (scrollHostRef2.current && scrollHostRef2.current.clientHeight) {
        const scrollHostElement = scrollHostRef2.current;
        const { clientHeight, scrollHeight } = scrollHostElement;
        const scrollBoxPercentage = clientHeight / scrollHeight;
        const scrollbarHeight = Math.max(
          scrollBoxPercentage * clientHeight,
          SCROLL_BOX_MIN_HEIGHT
        );
        setScrollBoxHeight2(scrollbarHeight);
        scrollHostElement.addEventListener("scroll", handleScroll2, true);
        return function cleanup() {
          scrollHostElement.removeEventListener("scroll", handleScroll2, true);
        };
    }
  }, [scrollBoxTop2, hovering2]);

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

  useEffect(() => {
    //this is handle the dragging on scroll-thumb
    document.addEventListener("mousemove", handleDocumentMouseMove2);
    document.addEventListener("mouseup", handleDocumentMouseUp2);
    document.addEventListener("mouseleave", handleDocumentMouseUp2);
    return function cleanup() {
      document.removeEventListener("mousemove", handleDocumentMouseMove2);
      document.removeEventListener("mouseup", handleDocumentMouseUp2);
      document.removeEventListener("mouseleave", handleDocumentMouseUp2);
    };
  }, [handleDocumentMouseMove2, handleDocumentMouseUp2]);


    return (
         <Transition.Root show={show} as={Fragment} {...handlers}>
    <Dialog 
    onMouseOver={handleMouseOver2}
    onMouseOut={handleMouseOut2}
    {...handlers}
    initialFocus={cancelButtonRef0}
    as="div" 
    className="fixed z-[9990] inset-0" 
    onClose={onClose}>
      <div {...handlers} ref={scrollHostRef2} className="scrollhost3">
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
          <Dialog.Overlay {...handlers}/>
        </Transition.Child>
        <div {...handlers} className="mx-auto inset-0 flex justify-center">
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
      <div onClick={(e) => {e.target !== document.querySelector(".swiper-button-prev") && e.target !== document.querySelector(".swiper-button-next") && !imageColumn.current.contains(e.target) && e.target !== document.querySelector(".modalBlock") && setActive(true); for (let i of document.querySelectorAll('.swiper-pagination')) {
        if (e.target == i) {
          setActive(false)
        }
      }; for (let i of document.querySelectorAll('.swiper-pagination-bullet')) {
        if (e.target == i) {
          setActive(false)
        }
      }}} style={{background: active && onClose()}} className="w-screen bg-black bg-opacity-75">
      <div className="xxs:hidden lg:block sticky top-0">
              <button ref={cancelButtonRef0} onClick={onClose} type="button" className="text-gray-400 hover:bg-opacity-75 hover:bg-gray-800 hover:text-[#ff00a7] rounded-full text-sm p-1.5 ml-auto inline-flex items-center outline-none absolute z-[9999] right-2 top-2">
                  <svg className="w-7 h-7 highlight-removal outline-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
              </button>
          </div>
          <div>
      <div  className="flex flex-col justify-center items-start md:flex-row md:items-start lg:space-x-6 md:max-w-[1080px] mx-auto">
      <div
      ref={imageColumn}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={`scrollhost-container xxs:hidden lg:block w-[90.2px] cursor-pointer h-[613px] z-10`}>
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
          <div className="modalBlock relative xxs:hidden lg:block w-full max-w-screen-md">
            {
              variantImages.length !== 0 ? (
                [variantImages[imageIndex]].map(el => (
                  el &&
                    <div>
                      {
                        <figure 
                        className="w-full block cursor-pointer">
                          <Image 
                          className='z-[9999] relative'
                          id='enlargeImage'
                          onClick={(e)=> {e.preventDefault(); e.stopPropagation(); window.open(`${el.image}`, "_blank")}} 
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
                        className="w-full block cursor-pointer">
                          <Image 
                          className='z-[9999] relative'
                          id='enlargeImage2'
                          onClick={(e)=> {e.preventDefault(); e.stopPropagation(); window.open(`${el.image}`, "_blank")}}
                          src={image.node.originalSrc} 
                          width='500' height='800' layout="responsive" objectFit="cover" />
                        </figure>
                      }
                      </div>
                  ))
              )
            
            }
          </div>

        </div>
        </div>
        <div className="xxs:block lg:hidden">
        <button ref={cancelButtonRef2} onClick={onClose} type="button" className="text-gray-400 bg-opacity-75 bg-gray-800 rounded-full hover:text-[#ff00a7] text-sm p-1.5 ml-auto inline-flex items-center outline-none absolute z-[9999] xs:!right-2 xs:!top-2 xxs:right-0 xxs:top-0">
                  <svg className="w-7 h-7 highlight-removal outline-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
              </button>
            <Swiper
            style={{ '--swiper-navigation-color': 'transparent', '--swiper-pagination-color': 'transparent' }}
            navigation={true}
            pagination={{ clickable: true }}
            loop='true'
          >
            {variantImagesArray.length === 0 ? noVariantsArray : variantImagesArray}
          </Swiper>
        </div>
        </div>
      </div>
      </Transition.Child>
        </div>
      </div>
      <div onClick={handleTrackClick} ref={scrollTrackRef} className={"scroll-bar3"} id="scrb3">
        <div
          id="scrt3"
          className={"scroll-thumb3"}
          style={{ height: scrollBoxHeight2 - 8, top: scrollBoxTop2 }}
          onMouseDown={handleScrollThumbMouseDown2}
        />
      </div>
    </Dialog>
  </Transition.Root>
    )
}