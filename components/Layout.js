import React, { useState, useCallback, useEffect, useRef } from "react"
import Nav from './Nav'
import Footer from './Footer'
import { useRouter } from "next/router";


const SCROLL_BOX_MIN_HEIGHT = 20;

export default function Layout({ children, className, ...restProps }) {
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const div = document.querySelector('.scrollhost')
    const thumb = document.querySelector('.scroll-thumb')
    const onScroll = () => {
      setScrollTop(div.scrollTop);
      setScrolling(div.scrollTop > scrollTop || div.scrollTop < scrollTop);
    };
    div.addEventListener("scroll", onScroll);

    (function(timer) {
        div.addEventListener('scroll', function(e) {
          thumb.classList.add('toggleScrollThumb');
          clearTimeout(timer);
          timer = setTimeout(function() {
            thumb.classList.remove('toggleScrollThumb');
          }, 100);    
        })
    })();

    return () => {div.removeEventListener("scroll", onScroll)};
  }, [scrollTop]);

  const router = useRouter();
  
  useEffect(()=>{
    const handleRouteChange = () => {
        document.querySelector('.top').scrollIntoView();
  }
  router.events.on('routeChangeComplete', handleRouteChange)
  },[]);

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
  }, [scrollBoxTop]);

  const scrollHostRef = useRef();

  useEffect(() => {
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(
      scrollThumbPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT
    );
    setScrollBoxHeight(scrollThumbHeight);
    scrollHostElement.addEventListener("scroll", handleScroll, true);
    return function cleanup() {
      scrollHostElement.removeEventListener("scroll", handleScroll, true);
    };
  }, [scrollBoxTop]);

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

        <main>
            {children}
        </main>

        <Footer />
        
    </div>
    </div>
      <div className={"scroll-bar"}>
        <div
          className={"scroll-thumb hide"}
          style={{ height: scrollBoxHeight, top: scrollBoxTop }}
          onMouseDown={handleScrollThumbMouseDown}
        />
      </div>
    </div>
    </div>
    </>
  )
}
