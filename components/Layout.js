import React, { useState, useCallback, useEffect, useRef } from "react"
import Nav from './Nav'
import Footer from './Footer'
import { useRouter } from "next/router";


const SCROLL_BOX_MIN_HEIGHT = 20;

export default function Layout({ children, className, ...restProps }) {
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT)
  const [scrollBoxTop, setScrollBoxTop] = useState(0)
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0)
  const [isDragging, setDragging] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const scrollHostRef = useRef()
  const scrollTrackRef = useRef()


  useEffect(() => {
    const div = document.querySelector('.scrollhost')
    const thumb = document.querySelector('.scroll-thumb')
    const onScroll = () => {
      setScrollTop(div.scrollTop);
      setScrolling(div.scrollTop > scrollTop || div.scrollTop < scrollTop)
    }
    div.addEventListener("scroll", onScroll);

    (function(timer) {
        div.addEventListener('scroll', function(e) {
          thumb.classList.add('toggleScrollThumb')
          clearTimeout(timer)
          timer = setTimeout(function() {
            thumb.classList.remove('toggleScrollThumb')
          }, 100)
        })
    })()

    return () => {div.removeEventListener("scroll", onScroll)}
  }, [scrollTop])

  const router = useRouter()
  
  useEffect(()=>{
    const handleRouteChange = () => {
        document.querySelector('.top').scrollIntoView()
  }
  router.events.on('routeChangeComplete', handleRouteChange)
  },[])

  const handleDocumentMouseUp = useCallback(
    e => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false)
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
      return;
    }
    const scrollHostElement = scrollHostRef.current
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight)
    setScrollBoxTop(newTop)
  }, [scrollBoxTop])

  const handleTrackClick = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      const { current: trackCurrent } = scrollTrackRef
      const { current: contentCurrent } = scrollHostRef
      if (trackCurrent && contentCurrent && (e.target !== document.getElementById("thumb"))) {
        // First, figure out where we clicked
        const { clientY } = e
        // Next, figure out the distance between the top of the track and the top of the viewport
        const target = e.target
        const rect = target.getBoundingClientRect()
        const trackTop = rect.top
        // We want the middle of the thumb to jump to where we clicked, so we subtract half the thumb's height to offset the position
        const thumbOffset = -(scrollBoxHeight / 2)
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
    [scrollBoxHeight]
  );

  const size = useWindowSize();

  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

  useEffect(() => {
    const scrollHostElement = scrollHostRef.current
    const { clientHeight, scrollHeight } = scrollHostElement
    const scrollThumbPercentage = clientHeight / scrollHeight
    const scrollThumbHeight = Math.max(
      scrollThumbPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT
    )
    setScrollBoxHeight(scrollThumbHeight)
    scrollHostElement.addEventListener("scroll", handleScroll, true)
    return function cleanup() {
      scrollHostElement.removeEventListener("scroll", handleScroll, true)
    }
  }, [scrollBoxTop, size.height])

  useEffect(() => {
    //this handles the dragging on scroll-thumb
    document.addEventListener("mousemove", handleDocumentMouseMove)
    document.addEventListener("mouseup", handleDocumentMouseUp)
    document.addEventListener("mouseleave", handleDocumentMouseUp)
    return function cleanup() {
      document.removeEventListener("mousemove", handleDocumentMouseMove)
      document.removeEventListener("mouseup", handleDocumentMouseUp)
      document.removeEventListener("mouseleave", handleDocumentMouseUp)
    }
  }, [handleDocumentMouseMove, handleDocumentMouseUp])


  return (
    <>
    <div className="App">
    <div
      className={"scrollhost-container"}
    >
      <div
        ref={scrollHostRef}
        className={`scrollhost ${className}`}
        {...restProps}
      >
    <div className='flex flex-col justify-between'>
      <div className="top"></div>
        <Nav />

        <main className="bg-[#0A0A0A]">
            {children}
        </main>

        <Footer />
        
    </div>
    </div>
      <div onClick={handleTrackClick} ref={scrollTrackRef} className={"scroll-bar"}>
        <div
          className={"scroll-thumb"}
          id="thumb"
          style={{ height: scrollBoxHeight - 8, top: scrollBoxTop }}
          onMouseDown={handleScrollThumbMouseDown}
        />
      </div>
    </div>
    </div>
    </>
  )
}
