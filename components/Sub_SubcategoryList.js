import ProductCard from "./ProductCard"
import Link from "next/link"
import { useState, useRef, useEffect, Fragment, useLayoutEffect } from "react"
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import { Dialog, Transition } from '@headlessui/react'
import { useSwipeable } from 'react-swipeable'
import { XIcon } from '@heroicons/react/outline'
import ReactPaginate from "react-paginate"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import brands from "../brands"
import collections from '../categories'


const Sub_SubcategoryList = ({ productsBySub_Subcollection, category, subcategory, sub_subcategory, product }) => {

  const categoryTitle = collections.map(el => {
    if (el.handle === category) {
      return el.title
    }
  })

  const title = categoryTitle.filter(el => el !== undefined)

  const subcategories = collections.map(el => {
    if (el.handle === category) {
      return el.subcollections
    }
  })

  const filteredSubcategories = subcategories.filter(el => el !== undefined)

  const sub_subcategories = filteredSubcategories[0].map(el => {
    if (el.handle === subcategory) {
      return el.sub_subcollections
    }
  })

  const filteredSub_subcategories = sub_subcategories.filter(el => el !== undefined)

  const types = filteredSub_subcategories[0].map(el => {
    if (el.handle === sub_subcategory) {
      return el.types
    }
  })

  const filteredTypes = types.filter(el => el !== undefined)

  const [products, setProducts] = useState(productsBySub_Subcollection)
  const [pageNumber, setPageNumber] = useState(0)
  const productsPerPage = 20
  const productsVisited = pageNumber * productsPerPage

  const pageCount = Math.ceil(products.length / productsPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  useEffect(() => {
    localStorage.setItem('pageNumber', JSON.stringify(pageNumber))
  }, [pageNumber])

  useLayoutEffect(() => {
    if (localStorage.getItem('pageNumber')) {
      setPageNumber(JSON.parse(localStorage.getItem('pageNumber')))
    } else {
        localStorage.setItem('pageNumber', JSON.stringify(pageNumber))
    }
  }, [])

  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [showSizeFilter, setShowSizeFilter] = useState(false)
  const [showColorFilter, setShowColorFilter] = useState(false)
  const [showBrandsFilter, setShowBrandsFilter] = useState(false)
  const [showTypesFilter, setShowTypesFilter] = useState(false)

  const [priceTracker, setPriceTracker] = useState([])
  const [sizeTracker, setSizeTracker] = useState([])
  const [colorTracker, setColorTracker] = useState([])
  const [brandsTracker, setBrandsTracker] = useState([])

  const [showSortOptions, setShowSortOptions] = useState(false)

  const [sortOption, setSortOption] = useState('Best Sellers')

  function sortByBestSellers() {
      setSortOption('Best Sellers')
  }

  function sortByNewest() {
      setSortOption('Newest')
  }

  function sortByHighestPrice() {
      setSortOption('Highest Price')
  }

  function sortByLowestPrice() {
      setSortOption('Lowest Price')
  }

  function toggleSortOptions() {
    setShowSortOptions(checked => !checked)
  }

  const tabletRef = useRef()

  const desktopRef = useRef()

  const mobileRef = useRef()

  useEffect(() => {
    function handleClickOutside(event) {
        if (tabletRef.current && !tabletRef.current.contains(event.target) && mobileRef.current && !mobileRef.current.contains(event.target) && desktopRef.current && !desktopRef.current.contains(event.target)) {
          setShowSortOptions(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tabletRef, desktopRef, mobileRef]);

  const cancelButtonRef = useRef()

  const handlers = useSwipeable({
      onSwipedRight: () => {setShowFilterOptions(false); setShowPriceFilter(false); setShowSizeFilter(false); setShowColorFilter(false); setShowBrandsFilter(false)},
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
    });

  const [min, setMin] = useState(0)
  const [max, setMax] = useState(500)
  const [minVal, setMinVal] = useState(0)
  const [maxVal, setMaxVal] = useState(500)

  const onSliderChange = (value) => {
    setMinVal(value[0])
    setMaxVal(value[1])
  }

  useEffect(() => {
    let newArray = []
    productsBySub_Subcollection.map(product => {
      if (product.node.priceRange.minVariantPrice.amount >= minVal && product.node.priceRange.minVariantPrice.amount <= maxVal) {
        newArray.push(product)
      } 
    })
    setPriceTracker(newArray)
  }, [minVal, maxVal])

  const sizes = [...new Set(productsBySub_Subcollection.map(product => (
    product.node.options[0].values
  )).flat())]

  const [checkedSize, setCheckedSize] = useState({})

  const toggleSize = name => {
    setCheckedSize(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const colors = [...new Set(productsBySub_Subcollection.map(product => (
    product.node.tags
  )).flat())]

  const [checkedColor, setCheckedColor] = useState({})

  const toggleColor = name => {
    setCheckedColor(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  useEffect(() => {
      let selectedSizesArray = Object.entries(checkedSize).filter(val => !val.includes(false)).map(el => el[0])
      let newArray = []
      productsBySub_Subcollection.map(product => {
        product.node.variants.edges.map(el => {
          if ((selectedSizesArray.includes(el.node.title)) && (el.node.availableForSale == true) && (!newArray.includes(product))) {
            newArray.push(product)
          }
        })
      })
      setSizeTracker(newArray)
  }, [checkedSize])

  useEffect(() => {
    let selectedColorsArray = Object.entries(checkedColor).filter(val => !val.includes(false)).map(el => el[0])
    let newArray = []
    productsBySub_Subcollection.map(product => {
      product.node.variants.edges.map(el => {
        if (product.node.tags.some(tag => selectedColorsArray.includes(tag)) && (el.node.availableForSale == true) && (!newArray.includes(product))) {
          newArray.push(product)
        }
      })
    })
    setColorTracker(newArray)
  }, [checkedColor])

  const brandsArray = brands.map(el => el.subcollections.map(el => el.title))

  const [checkedBrand, setCheckedBrand] = useState({})

  const toggleBrand = name => {
    setCheckedBrand(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  useEffect(() => {
    let selectedBrandsArray = Object.entries(checkedBrand).filter(val => !val.includes(false)).map(el => el[0])
    let newArray = []
    productsBySub_Subcollection.map(product => {
      product.node.variants.edges.map(el => {
        if ((product.node.collections.edges.some(brand => selectedBrandsArray.includes(brand.node.title))) && (el.node.availableForSale == true) && (!newArray.includes(product))) {
          newArray.push(product)
        }
      })
    })
    setBrandsTracker(newArray)
  }, [checkedBrand])

  useEffect(() => {
    let newArray = []
    let productsArray = []
    const tracker = [priceTracker, sizeTracker, colorTracker, brandsTracker]
    tracker.map(arr => {
      if (arr.length !== 0) {
        newArray.push(arr)
      }
    })
    if (newArray.length === 1) {
      for (let i of newArray[0]) {
        productsArray.push(i)
      }
    }
    if (newArray.length === 2) {
      for (let i of newArray[0]) {
        for (let j of newArray[1]) {
          if (i.node.title === j.node.title) {
            productsArray.push(i)
          }
        }
      }
    }
    if (newArray.length === 3) {
      for (let i of newArray[0]) {
        for (let j of newArray[1]) {
          for (let k of newArray[2]) {
            if ((i.node.title === j.node.title) && (i.node.title === k.node.title)) {
              productsArray.push(i)
            }
          }
        }
      }
    }
    if (newArray.length === 4) {
      for (let i of newArray[0]) {
        for (let j of newArray[1]) {
          for (let k of newArray[2]) {
            for (let o of newArray[3]) {
              if ((i.node.title === j.node.title) && (i.node.title === k.node.title) && (i.node.title === o.node.title)) {
                productsArray.push(i)
              }
            }
          }
        }
      }
    }
    setProducts(productsArray)
  }, [priceTracker, sizeTracker, colorTracker, brandsTracker])

  return (
        <div className="bg-[#0a0a0a]">
        <div className="max-w-[1930px] mx-auto py-3">
        <div className="flex flex-wrap flex-row items-center text-sm sm:pt-2 w-full px-[15px]">
          <div className="text-2xl text-white xxs:mb-2 font-semibold tracking-wide">{
            filteredSub_subcategories[0].map(el => {
              if (sub_subcategory !== product.handle && el.handle === sub_subcategory) {
                  return el.title.toUpperCase()
              }
            })
          }</div>
          <div className="md:ml-auto md:flex md:flex-row xxs:hidden">
            <div>
            <div 
            ref={desktopRef}
            onMouseOver={() => setShowSortOptions(true)}
            onMouseLeave={() => setShowSortOptions(false)}
            className='xxs:invisible xxs:absolute xxs:z-[-1] xxs:opacity-0 lg:visible lg:relative lg:top-[11px] lg:z-[15] lg:opacity-100'>
                <span className="border-2 bg-black border-white p-1 pl-3 flex w-[200px] items-center justify-between">
                    <span className="select-none text-white font-semibold">SORT</span>
                    <span className={showSortOptions ? "rotate-180 transition-all ease-in-out duration-200" : "rotate-360 transition-all ease-in-out duration-200"}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                <div className='absolute'>
                <SlideDown className={'my-dropdown-slidedown'}>
                {
                    showSortOptions ? (
                        <div className='w-[200px] text-white relative whitespace-nowrap bg-black shadow-xl border-t-0 border-2 border-gray-500'>
                            <div 
                            onClick={() => {
                              sortByBestSellers();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Best Sellers' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>BEST SELLERS</div>
                            <div 
                            onClick={() => {
                              sortByNewest();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Newest' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>NEWEST</div>
                            <div 
                            onClick={() => {
                              sortByHighestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Highest Price' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>HIGHEST PRICE</div>
                            <div 
                            onClick={() => {
                              sortByLowestPrice();
                              setShowSortOptions(false)
                            }}
                            className={sortOption === 'Lowest Price' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer font-bold' : 'hover:bg-gray-800 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer'}>LOWEST PRICE</div>
                        </div>
                    ) : null
                }
                </SlideDown>
                </div>
            </div>
            <div 
            ref={tabletRef}
            onClick={() => toggleSortOptions()}
            className='xxs:invisible xxs:absolute xxs:z-[-1] xxs:opacity-0 md:visible md:relative md:top-[11px] md:z-[50] md:opacity-100 lg:invisible lg:absolute lg:z-[-1] lg:opacity-0'>
                <span className="border-2 bg-black border-white p-1 pl-3 flex w-[200px] items-center justify-between cursor-pointer">
                    <span className="select-none text-white font-semibold">SORT</span>
                    <span className={showSortOptions ? "rotate-180 transition-all ease-in-out duration-200" : "rotate-360 transition-all ease-in-out duration-200"}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                <div className='absolute'>
                <SlideDown className={'my-dropdown-slidedown'}>
                {
                    showSortOptions ? (
                        <div className='w-[200px] text-white relative whitespace-nowrap bg-black shadow-xl border-t-0 border-2 border-gray-500'>
                            <div 
                            onClick={() => {
                              sortByBestSellers();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Best Sellers' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Best Sellers</div>
                            <div 
                            onClick={() => {
                              sortByNewest();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Newest' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Newest</div>
                            <div 
                            onClick={() => {
                              sortByHighestPrice();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Highest Price' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Highest Price</div>
                            <div 
                            onClick={() => {
                              sortByLowestPrice();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Lowest Price' ? 'hover:bg-gray-800 w-[197px] p-3 text-[#ff00a7] cursor-pointer font-bold' : 'hover:bg-gray-800 w-[197px] p-3 hover:font-bold hover:text-white cursor-pointer'}>Lowest Price</div>
                        </div>
                    ) : null
                }
                </SlideDown>
                </div>
            </div>
            </div>
              <span onClick={() => setShowFilterOptions(true)} className="cursor-pointer border-2 border-white bg-black ml-[15px] p-1 pl-3 flex w-[200px] relative top-[11px] items-center justify-between">
                <span className="select-none text-white font-semibold">FILTER</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-[1px] rotate-90" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
          </div>
          </div>
          <div className="flex flex-row items-center text-sm xxs:mb-6 w-full pl-[15px]">
          <div>
            <Link href={'/'}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                Home
              </a>
            </Link>
          </div>
          <div className="text-white">
            &nbsp;
              {
                ' ' + '/' + ' '
              }
            &nbsp;
            </div>
          <div>
            <Link href={`/${category}`}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                {
                  title[0]
                }
              </a>
            </Link>
          </div>
          <div className="text-white">
            &nbsp;
              {
                ' ' + '/' + ' '
              }
            &nbsp;
            </div>
          <div>
            <Link href={`/${category}/${subcategory}`}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
               {
                 filteredSubcategories[0].map(el => {
                  if (subcategory !== product.handle && el.handle === subcategory) {
                      return el.title
                  }
                  })
               }
              </a>
            </Link>
          </div>
          <div className="text-white">
            &nbsp;
              {
                ' ' + '/' + ' '
              }
            &nbsp;
            </div>
          <div className="font-semibold text-[#ff00a7]">
               {
                 filteredSub_subcategories[0].map(el => {
                  if (sub_subcategory !== product.handle && el.handle === sub_subcategory) {
                      return el.title
                  }
                })
               }
          </div>
          </div>
          <div className="grid grid-cols-2 gap-x-[15px] mx-[15px] mb-6 md:hidden">
            <div>
            <div 
            ref={mobileRef}
            onClick={() => toggleSortOptions()}>
                <span className="cursor-pointer border-2 border-white p-1 pl-3 flex justify-between">
                    <span className="select-none font-semibold text-white">SORT</span>
                    <span className={showSortOptions ? "rotate-180 transition-all ease-in-out duration-200" : "rotate-360 transition-all ease-in-out duration-200"}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                
                {
                    showSortOptions ? (
                      <div className="relative">
                        <div className='text-white w-full max-w-md absolute whitespace-nowrap bg-black shadow-xl border-t-0 border-2 border-gray-500 z-50'>
                            <div 
                            onClick={() => {
                              sortByBestSellers();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Best Sellers' ? 'hover:bg-gray-800 p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Best Sellers</div>
                            <div 
                            onClick={() => {
                              sortByNewest();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Newest' ? 'hover:bg-gray-800 p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Newest</div>
                            <div 
                            onClick={() => {
                              sortByHighestPrice();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Highest Price' ? 'hover:bg-gray-800 p-3 text-[#ff00a7] cursor-pointer border-b border-b-gray-500 font-bold' : 'hover:bg-gray-800 border-b-gray-500 p-3 hover:font-bold hover:text-white cursor-pointer border-b'}>Highest Price</div>
                            <div 
                            onClick={() => {
                              sortByLowestPrice();
                              setShowSortOptions(true)
                            }}
                            className={sortOption === 'Lowest Price' ? 'hover:bg-gray-800 p-3 text-[#ff00a7] cursor-pointer font-bold' : 'hover:bg-gray-800 p-3 hover:font-bold hover:text-white cursor-pointer'}>Lowest Price</div>
                        </div>
                      </div>
                    ) : null
                }
                
            </div>
            </div>
              <span onClick={() => setShowFilterOptions(true)} className="cursor-pointer border-2 border-white p-1 pl-3 flex justify-between">
                <span className="select-none font-semibold text-white">FILTER</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-[2px] rotate-90" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
          </div>
          <Transition.Root show={showFilterOptions} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => setShowFilterOptions(false)}>
            <div {...handlers} className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 sm:pl-10 max-w-full flex">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => setShowFilterOptions(false)}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8 flex flex-col justify-between h-full text-white">
                          <div className="flex flex-col">
                            {
                              filteredTypes[0] && (
                                <div 
                            onClick={() => setShowTypesFilter(true)}
                            className="flex border-b justify-between items-center hover:text-[#ff00a7] hover:bg-gray-900 pl-3 cursor-pointer hover:font-semibold">
                                <span className="w-full h-[75px] flex items-center select-none">TYPES</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                              )
                            }
                          <div 
                            onClick={() => setShowBrandsFilter(true)}
                            className="flex border-b justify-between items-center hover:text-[#ff00a7] hover:bg-gray-900 pl-3 cursor-pointer hover:font-semibold">
                                <span className="w-full h-[75px] flex items-center select-none">BRAND</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                          <div 
                            onClick={() => setShowColorFilter(true)}
                            className="flex border-b justify-between items-center hover:text-[#ff00a7] hover:bg-gray-900 pl-3 cursor-pointer hover:font-semibold">
                                <span className="w-full h-[75px] flex items-center select-none">COLOR</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                            <div 
                            onClick={() => setShowSizeFilter(true)}
                            className="flex border-b justify-between items-center hover:text-[#ff00a7] hover:bg-gray-900 pl-3 cursor-pointer hover:font-semibold">
                                <span className="w-full h-[75px] flex items-center select-none">SIZE</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                            <div 
                            onClick={() => setShowPriceFilter(true)}
                            className="flex border-b justify-between items-center hover:text-[#ff00a7] hover:bg-gray-900 pl-3 cursor-pointer hover:font-semibold">
                                <span className="w-full h-[75px] flex items-center select-none">PRICE</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                          </div>
                          <button onClick={() => {
                            setMinVal(0);
                            setMaxVal(500);
                            setCheckedSize({});
                            setCheckedColor({});
                            setCheckedBrand({});
                          }} className="flex items-center justify-center w-full px-3 py-4 border-2 border-white text-white font-semibold hover:bg-[#ff00a7] hover:text-white transition-all ease-in-out duration-300">CLEAR ALL</button>
                      </div>
                      
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showPriceFilter} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => {setShowPriceFilter(false); setShowFilterOptions(false)}}>
            <div className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 overflow-hidden" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 max-w-full flex overflow-hidden">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="-translate-x-[500px]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo={(showFilterOptions === false) ? "translate-x-full" : "-translate-x-[500px]"}
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                        <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() =>setShowPriceFilter(false)}>
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => {setShowPriceFilter(false); setShowFilterOptions(false)}}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8">
                        <div>
                            <div className="flex flex-col">
                            <div 
                              className="flex border-b justify-between items-center pl-3 text-white">
                                  <span className="w-full h-[75px] flex items-center select-none">PRICE</span>
                              </div>
                            </div>
                            <div className="flex justify-between mt-4 !w-[85%] mx-auto text-white">
                              <span>$ {minVal}</span>
                              <span>$ {maxVal}</span>
                            </div>
                            <div>
                            <Slider
                              range
                              min={min}
                              max={max}
                              defaultValue={[minVal, maxVal]}
                              onChange={onSliderChange}
                              className="mt-6 !w-[85%] mx-auto"
                              handleStyle={{
                                borderColor: 'rgb(236 72 153)',
                                height: 20,
                                width: 20,
                                backgroundColor: 'white',
                                marginTop: "-8px",
                                opacity: "1"
                              }}
                              trackStyle={{ backgroundColor: 'rgb(249 168 212)', height: 6 }}
                              railStyle={{ backgroundColor: 'rgb(163 163 163)', height: 6 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showSizeFilter} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => {setShowSizeFilter(false); setShowFilterOptions(false)}}>
            <div className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 overflow-hidden" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 max-w-full flex overflow-hidden">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="-translate-x-[500px]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo={(showFilterOptions === false) ? "translate-x-full" : "-translate-x-[500px]"}
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                        <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() =>setShowSizeFilter(false)}>
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => {setShowSizeFilter(false); setShowFilterOptions(false)}}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8 text-white">
                        <div>
                            <div className="flex flex-col">
                            <div 
                              className="flex border-b justify-between items-center pl-3">
                                  <span className="w-full h-[75px] flex items-center select-none">SIZE</span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-5">
                            {
                              sizes.map(size => (
                                  <div className={checkedSize[size] ? "flex flex-row items-center justify-between text-[#ff00a7] hover:bg-gray-900 cursor-pointer" : "flex flex-row items-center justify-between hover:bg-gray-900 cursor-pointer"}>
                                  <div onClick={() => toggleSize(size)} className="w-full py-4 pl-3 select-none hover:font-semibold">{size}</div>
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" className={checkedSize[size] ? "h-6 w-6 mr-5" : "hidden"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>                     
                              ))
                            }
                            </div>
                        </div>
                      </div>
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showColorFilter} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => {setShowColorFilter(false); setShowFilterOptions(false)}}>
            <div className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 overflow-hidden" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 max-w-full flex overflow-hidden">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="-translate-x-[500px]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo={(showFilterOptions === false) ? "translate-x-full" : "-translate-x-[500px]"}
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                        <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() =>setShowColorFilter(false)}>
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => {setShowColorFilter(false); setShowFilterOptions(false)}}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8 text-white">
                        <div>
                            <div className="flex flex-col">
                            <div 
                              className="flex border-b justify-between items-center pl-3">
                                  <span className="w-full h-[75px] flex items-center select-none">COLOR</span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-5">
                            {
                              colors.map(color => (
                                  <div className={checkedColor[color] ? "flex flex-row items-center justify-between hover:bg-gray-900 text-[#ff00a7] cursor-pointer" : "flex flex-row items-center justify-between hover:bg-gray-900 cursor-pointer"}>
                                  <div onClick={() => toggleColor(color)} className="w-full py-4 pl-3 select-none hover:font-semibold">{color.toUpperCase()}</div>
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" className={checkedColor[color] ? "h-6 w-6 mr-5" : "hidden"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>                     
                              ))
                            }
                            </div>
                        </div>
                      </div>
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showBrandsFilter} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => {setShowBrandsFilter(false); setShowFilterOptions(false)}}>
            <div className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 overflow-hidden" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 max-w-full flex overflow-hidden">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="-translate-x-[500px]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo={(showFilterOptions === false) ? "translate-x-full" : "-translate-x-[500px]"}
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                        <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() =>setShowBrandsFilter(false)}>
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => {setShowBrandsFilter(false); setShowFilterOptions(false)}}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8 text-white">
                        <div>
                            <div className="flex flex-col">
                            <div 
                              className="flex border-b justify-between items-center pl-3">
                                  <span className="w-full h-[75px] flex items-center select-none">BRAND</span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-5">
                            {
                              brandsArray[0].map(brand => (
                                  <div className={checkedBrand[brand] ? "flex flex-row items-center justify-between hover:bg-gray-900 text-[#ff00a7] cursor-pointer" : "flex flex-row items-center justify-between hover:bg-gray-900 cursor-pointer"}>
                                  <div onClick={() => toggleBrand(brand)} className="w-full py-4 pl-3 select-none hover:font-semibold">{brand.toUpperCase()}</div>
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" className={checkedBrand[brand] ? "h-6 w-6 mr-5" : "hidden"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>                     
                              ))
                            }
                            </div>
                        </div>
                      </div>
                    </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {
        filteredTypes[0] && (
          <Transition.Root show={showTypesFilter} as={Fragment} {...handlers}>
        <Dialog 
        initialFocus={cancelButtonRef}
        as="div" 
        className="fixed z-50 inset-0 overflow-hidden" 
        onClose={() => {setShowTypesFilter(false); setShowFilterOptions(false)}}>
            <div className="absolute inset-0">
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog.Overlay className="absolute inset-0 overflow-hidden" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 max-w-full flex overflow-hidden">
                <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-[600ms]"
                enterFrom="-translate-x-[500px]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-[600ms]"
                leaveFrom="translate-x-0"
                leaveTo={(showFilterOptions === false) ? "translate-x-full" : "-translate-x-[500px]"}
                >
                    <div className="p-6 flex flex-col w-screen sm:max-w-md bg-[#0A0A0A] shadow-xl overflow-y-scroll">
                        <div className="flex items-start justify-between">
                        <button
                        ref={cancelButtonRef}
                        type="button"
                        className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                        onClick={() =>setShowTypesFilter(false)}>
                        <span className="sr-only">Close panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                          <Dialog.Title className="text-xl font-semibold mx-auto text-white select-none">FILTER</Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="-m-2 p-2 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-[#ff00a7] focus-visible:ring-offset-[#ff00a7] focus-visible:ring-offset-2 focus-visible:border-[#ff00a7] hover:ring-1 hover:ring-[#ff00a7] hover:border-[#ff00a7] hover:ring-offset-2 hover:ring-offset-[#ff00a7]"
                                onClick={() => {setShowTypesFilter(false); setShowFilterOptions(false)}}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                          </div>
                        </div>
                        <div className="mt-8 text-white">
                        <div>
                            <div className="flex flex-col">
                            <div 
                              className="flex border-b justify-between items-center pl-3">
                                  <span className="w-full h-[75px] flex items-center select-none">TYPES</span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-5">
                            {
                              filteredTypes[0]?.map(el => (
                                <Link href={`/${category}/${subcategory}/${sub_subcategory}/${el.handle}`}>
                                  <a>
                                    <div className="flex flex-row items-center justify-between hover:bg-gray-900 cursor-pointer">
                                      <div className="w-full py-4 pl-3 select-none hover:font-semibold">{el.title.toUpperCase()}</div>
                                    </div>
                                  </a>
                                </Link>
                              ))
                            }
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
            <div className="sm:mx-0 grid grid-cols-2 gap-y-10 xxs:gap-x-[15px] sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer">
              {
                (sortOption === 'Best Sellers') ? (
                  [...products].slice(productsVisited, productsVisited + productsPerPage).map(product => (
                    <ProductCard key={product.node.id} product={product} />
                )) 
                ) : (sortOption === 'Newest') ? (
                  [...products].sort((a, b) => (
                    (a.node.createdAt < b.node.createdAt) ? 1 : ((a.node.createdAt > b.node.createdAt) ? -1 : 0)
                  )).slice(productsVisited, productsVisited + productsPerPage).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  ))
                ) : (sortOption === 'Highest Price') ? (
                  [...products].sort((a, b) => (
                    (b.node.priceRange.minVariantPrice.amount - a.node.priceRange.minVariantPrice.amount)
                  )).slice(productsVisited, productsVisited + productsPerPage).map(product => (
                      <ProductCard key={product.node.id} product={product} />
                  )) 
                ) : (sortOption === 'Lowest Price') ? (
                  [...products].sort((a, b) => (
                      (a.node.priceRange.minVariantPrice.amount - b.node.priceRange.minVariantPrice.amount)
                    )).slice(productsVisited, productsVisited + productsPerPage).map(product => (
                        <ProductCard key={product.node.id} product={product} />
                    ))
                ) : null
              }
            </div>
           </div>
           {
             pageCount > 1 && productsPerPage >= 1 && (
              <ReactPaginate 
              previousLabel={""}
              nextLabel={""}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
              forcePage={pageNumber}/>
             )
           }
          </div>
  )
}

export default Sub_SubcategoryList