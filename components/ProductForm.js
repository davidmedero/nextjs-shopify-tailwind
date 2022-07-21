import { useState, useContext, useEffect, useLayoutEffect, useCallback } from "react"
import { formatter, GBPFormatter, EURFormatter } from "../utils/helpers"
import ProductOptions from "./ProductOptions"
import { CartContext } from '../context/shopContext'
import Head from 'next/head'
import Link from "next/link"
import collections from "../categories"
import { useRouter } from "next/router"
import useSWR, { useSWRConfig } from "swr"
import axios from "axios"
import { useSession } from "next-auth/react"
import SignInModal from "./SignInModal"


const fetcher = url => axios.get(url).then(res => res.data)


export default function ProductForm({ product, variantImages }) {

    const router = useRouter()

    const { mutate } = useSWRConfig()

    const { data: session } = useSession()
    const email = session?.user.email

    const [showSignInModal, setShowSignInModal] = useState(false)

    const [currencyRates, setCurrencyRates] = useState(0)

    const [currency, setCurrency] = useState('')

    // useEffect(() => {
    //     fetch('http://api.exchangeratesapi.io/v1/latest?access_key=35ec150f1f16d6ce49fa8427128872c1&base=USD')
    //     .then(res => res.json())
    //     .then(data => setCurrencyRates(data.rates))
    // }, [])

    // const shopifyConversionFee = 1.015
  
    // const GBPcurrency = [currencyRates].map(currency => currency.GBP).join('')
  
    // const EURcurrency = [currencyRates].map(currency => currency.EUR).join('')

    const shopifyConversionFee = 1.015

    const GBPcurrency = 0.82

    const EURcurrency = 0.96
  
    useLayoutEffect(() => {
      setCurrency(JSON.parse(localStorage.getItem('current_currency')))
      window.addEventListener('storage', () => {
        setCurrency(JSON.parse(localStorage.getItem('current_currency')))
      })
    }, [])

    const categories = collections

    const { cart, addToCart } = useContext(CartContext)

    const allVariantOptions = product.variants.edges?.map(variant => {
        const allOptions = {}

        variant.node.selectedOptions.map(item => {
            allOptions[item.name] = item.value
        })

        return {
            id: variant.node.id,
            title: product.title,
            handle: product.handle,
            image: variant.node.image?.originalSrc,
            variantImages: variantImages,
            variantLink: router.asPath,
            options: allOptions,
            variantTitle: variant.node.title,
            variantPrice: variant.node.priceV2.amount,
            variantQuantity: 1,
            newVariantQuantity: 1
        }
    })

    const defaultValues = {}
    product.options.map(item => {
      defaultValues[item.name] = item.values[0]
    })

    const [selectedVariant, setSelectedVariant] = useState({})
    const [selectedOptions, setSelectedOptions] = useState({})
    const [counter, setCounter] = useState(1)

    function setOptions(name, value) {
        setSelectedOptions(prevState => {
            return { ...prevState, [name]: value }
        })

        const selection = {
            ...selectedOptions, 
            [name]: value
        }
        
        allVariantOptions.map(item => {
            if ((JSON.stringify(item.options) === JSON.stringify(selection))) {
                setSelectedVariant(item)
                setCounter(1)
            }
        })
    }

    const [checkedSize, setCheckedSize] = useState(false)

    useEffect(() => {
        window.addEventListener('selectSize', () => {
            setCheckedSize(true)
        })
      }, [])

    const increment = () => {
        counter < 9 ? counter += 1 : counter = 9
        setCounter(counter)

        cart.map(_ => {
            if ((cart.includes(selectedVariant)) && counter < 9) {
                selectedVariant.newVariantQuantity = counter
                setCounter(selectedVariant.newVariantQuantity)
            } else if ((!cart.includes(selectedVariant)) && counter < 9) {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
    }

    const decrement = () => {
        counter > 1 ? counter -= 1 : counter = 1
        setCounter(counter)

        cart.map(_ => {
            if ((cart.includes(selectedVariant)) && counter > 1) {
                selectedVariant.newVariantQuantity = counter
                setCounter(selectedVariant.newVariantQuantity)
            } else if ((!cart.includes(selectedVariant)) && counter > 1) {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
    }

    const handleChange = (e) => {
        counter = Number(e.target.value);
        setCounter(counter)

        cart.map(_ => {
            if (cart.includes(selectedVariant)) {
                selectedVariant.newVariantQuantity = counter
                setCounter(selectedVariant.newVariantQuantity)
            } else if (!cart.includes(selectedVariant)) {
                selectedVariant.variantQuantity = counter
                setCounter(selectedVariant.variantQuantity)
            }
        })
        if (cart.length === 0) {
            selectedVariant.variantQuantity = counter
            setCounter(selectedVariant.variantQuantity)
        }
        if (e.key === 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 ) {
            e.target.blur();
        }
        if (isNaN(counter) || (e.target.value == 0)) {
            e.target.value = 1
            parseInt(e.target.value)
            counter = 1
            selectedVariant.variantQuantity = counter
            selectedVariant.newVariantQuantity = counter
            setCounter(1)
        }
    }

    const [color, setColor] = useState('')

    useEffect(() => {
        const url = new URL(window.location)
        if (url.searchParams.get('color')) {
        setColor(url.searchParams.get('color'))
        }
    }, [selectedVariant, selectedOptions])

    useEffect(() => {
        const url = new URL(window.location)
        if (url.searchParams.get('color')) {
          setColor(url.searchParams.get('color'))
        }
    }, [])

    const [sizesOutline, setSizesOutline] = useState(false)

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
    <div className="xxs:mt-[20px] md:!mt-0 pt-2 !pb-0 relative -top-4 md:top-0 flex flex-col xxs:w-full md:w-[390px] md:mx-3 lg:mr-0">
        <div className="xxs:mx-[15px] md:mx-0">
        <Head>
            <script type='text/javascript' id={product.id}>
                {
                    `for (let button of document.querySelectorAll(".selectSection button")) {

                        let slideUp = (target, duration=500) => {

                            target.style.transitionProperty = 'height, margin, padding';
                            target.style.transitionDuration = duration + 'ms';
                            target.style.boxSizing = 'border-box';
                            target.style.height = target.offsetHeight + 'px';
                            target.offsetHeight;
                            target.style.overflow = 'hidden';
                            target.style.height = 0;
                            target.style.paddingTop = 0;
                            target.style.paddingBottom = 0;
                            target.style.marginTop = 0;
                            target.style.marginBottom = 0;
                            window.setTimeout( () => {
                                  target.style.display = 'none';
                                  target.style.removeProperty('height');
                                  target.style.removeProperty('padding-top');
                                  target.style.removeProperty('padding-bottom');
                                  target.style.removeProperty('margin-top');
                                  target.style.removeProperty('margin-bottom');
                                  target.style.removeProperty('overflow');
                                  target.style.removeProperty('transition-duration');
                                  target.style.removeProperty('transition-property');
                                  //alert("!");
                            }, duration);
                        }
                    
                        let slideDown = (target, duration=500) => {
                    
                            target.style.removeProperty('display');
                            let display = window.getComputedStyle(target).display;
                            if (display === 'none') display = 'block';
                            target.style.display = display;
                            let height = target.offsetHeight;
                            target.style.overflow = 'hidden';
                            target.style.height = 0;
                            target.style.paddingTop = 0;
                            target.style.paddingBottom = 0;
                            target.style.marginTop = 0;
                            target.style.marginBottom = 0;
                            target.offsetHeight;
                            target.style.boxSizing = 'border-box';
                            target.style.transitionProperty = "height, margin, padding";
                            target.style.transitionDuration = duration + 'ms';
                            target.style.height = height + 'px';
                            target.style.removeProperty('padding-top');
                            target.style.removeProperty('padding-bottom');
                            target.style.removeProperty('margin-top');
                            target.style.removeProperty('margin-bottom');
                            window.setTimeout( () => {
                              target.style.removeProperty('height');
                              target.style.removeProperty('overflow');
                              target.style.removeProperty('transition-duration');
                              target.style.removeProperty('transition-property');
                            }, duration);
                        }
                    
                        let allContent = document.querySelectorAll('.content');
                
                        for (let content of allContent) {
                            allContent[0].classList.add('toggled');
                            allContent[3].classList.add('toggled');
                        }
                
                        let chevrons = document.querySelectorAll(".chevron");
                        let minuses = document.querySelectorAll(".minus");
                
                        for (let minus of minuses) {
                            minuses[0].classList.add('toggled');
                            minuses[3].classList.add('toggled');
                        }
                
                        for (let chevron of chevrons) {
                            chevrons[1].classList.add('toggled');
                            chevrons[2].classList.add('toggled');
                        }
                
                        button.addEventListener('click', (e) => {
                
                            let chevrons = document.querySelectorAll(".chevron");
                            let minuses = document.querySelectorAll(".minus");
                
                            for (let chevron of chevrons) {
                                if (chevron.getAttribute('data-number') === button.getAttribute('data-number')) {
                                    chevron.classList.toggle('toggled');
                                    }
                
                                else if (chevron.getAttribute('data-number') !== button.getAttribute('data-number')) {
                                    chevron.classList.add('toggled');
                                }
                            }
                
                            for (let minus of minuses) {
                                if (minus.getAttribute('data-number') === button.getAttribute('data-number')) {
                                    minus.classList.toggle('toggled');
                                }
                        
                                else if (minus.getAttribute('data-number') !== button.getAttribute('data-number')) {
                                    minus.classList.remove('toggled');
                                }
                            }
                            
                            let allContent = document.querySelectorAll('.content');
 
                            for (let content of allContent) {
                                let slideToggle = (target, duration = 500) => {
                                    if (window.getComputedStyle(target).display === 'none') {
                                      return slideDown(target, duration);
                                    } else {
                                      return slideUp(target, duration);
                                    }
                                }
                                if (content.getAttribute('data-number') === button.getAttribute('data-number')) {
                                    slideToggle(content, 300);
                                    content.classList.toggle('.toggled');
                                }
                                else if (content.getAttribute('data-number') !== button.getAttribute('data-number')) {
                                    slideUp(content, 300);
                                    content.classList.remove('.toggled');
                                }
                            }
                        });
                        }
                `
                }
            </script>
        </Head>
      <h2 className="text-2xl font-bold text-white">{product.title} {selectedOptions.Color && (' - ' + color)}</h2>
      <span className="pb-3 text-xl text-white">{
      currency === '' ? formatter.format(product.variants.edges[0].node.priceV2.amount) :
      currency === 'USD' ? formatter.format(product.variants.edges[0].node.priceV2.amount) :
      currency === 'GBP' ? GBPFormatter.format(Math.ceil(product.variants.edges[0].node.priceV2.amount * GBPcurrency * shopifyConversionFee)) :
      currency === 'EUR' ? EURFormatter.format(Math.ceil(product.variants.edges[0].node.priceV2.amount * EURcurrency * shopifyConversionFee)) :
      null
      }</span>
        {
            product.options.map(({ name, values }) => (
                <ProductOptions 
                key={`key-${name}`}
                name={name}
                values={values}
                selectedOptions={selectedOptions}
                setOptions={setOptions}
                selectedVariant={selectedVariant}
                product={product}
                sizesOutline={sizesOutline}
                checkedSize={checkedSize}
                />
            ))
        }
       <div className="text-base rounded-sm shadow-md flex justify-between xxs:w-full mt-[17px]">
        
        <input id="quantity_input" autocomplete='off' inputMode='numeric' pattern="[0-9]*" onFocus={(e) => e.target.value = ""} onBlur={(e) => e.target.value = counter} className="text-base border-b border-t border-l text-white bg-black transition-all ease-in-out duration-100 relative focus:outline-2 outline-[#ff00a7] caret-[#ff00a7] w-full xxs:rounded-l-sm xxs:rounded-r-none pl-[36px] py-2 text-center" type="text"  value={counter} onChange={handleChange} />

        <span className="flex"> 
        <button 
        onClick={decrement}
        className='bg-black border-t border-b border-l text-white highlight-removal transition-all ease-in-out duration-100 px-3 py-2 hover:bg-gray-800 active:bg-gray-700 hover:text-white active:text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
        onClick={increment}
        className='bg-black border text-white highlight-removal transition-all ease-in-out duration-100 px-3 py-2 hover:bg-gray-800 active:bg-gray-700 hover:text-white active:text-white rounded-r-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>  
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
      {
        checkedSize === false ? (
            <button 
            onMouseOver={() => setSizesOutline(true)}
            onMouseLeave={() => setSizesOutline(false)}
            className={"shadow-md select-none transition-all ease-in-out duration-400 rounded-sm font-semibold bg-[#ff00a7] text-white w-full px-2 py-3 hover:bg-[#d4008a]"}>SELECT A SIZE</button>
        ) : (
            <button 
        onClick={() => {
            addToCart(selectedVariant)
            setCounter(1)
        }}
        className={"shadow-md select-none transition-all ease-in-out duration-400 rounded-sm font-semibold bg-[#ff00a7] text-white w-full px-2 py-3 hover:bg-[#d4008a]"}>ADD TO BAG</button>
        )
      }
      {session && (
            <>
            <span 
              onMouseOver={() => setHeartFill(true)}
              onMouseLeave={() => setHeartFill(false)}
              onClick={(e) => {
                handleButtonClick(e);
                updateMacros()
              }}
              className="m-3 mr-0 p-2 border rounded-full z-[10] cursor-pointer">
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
              className="m-3 mr-0 p-2 border rounded-full z-[10] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill={heartFill || added ? "#ff00a7" : "none"} viewBox="0 0 24 24" stroke={heartFill || added ? "#ff00a7" : "white"} stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </>
            )}
            </div>
            <SignInModal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
            </SignInModal>
    <div className="mt-3">
    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}></div>
    <div className="selectSection">
    <button className="select-none -mt-[11px]" data-number="4" type="button"> <svg xmlns="http://www.w3.org/2000/svg" className="chevron" data-number="4" fill="none" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path> </svg> <svg xmlns="http://www.w3.org/2000/svg" className="minus" data-number="4" fill="none" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"></path> </svg> View More </button>
    <div data-number="4" className="content ml-[35px] mb-[16px]">
    {
    product.collections.edges.map(el => (
        categories.map(category => (
            el.node.id === category.id ? (
                <span className="hover:underline hover:decoration-[#ff00a7] hover:text-[#ff00a7]">
                    <Link href={`/${category.handle}`}>
                        <a>
                            {el.node.title}
                        </a>
                    </Link>
                </span>
            ) : category.subcollections?.map(subcategory => (
                el.node.id === subcategory.id ? (
                    <span>{' | '}
                        <span className="hover:underline hover:decoration-[#ff00a7] hover:text-[#ff00a7]">
                            <Link href={`/${category.handle}/${subcategory.handle}`}>
                                <a>
                                    {el.node.title}
                                </a>
                            </Link>
                        </span>
                    </span>
                ) : subcategory.sub_subcollections?.map(sub_subcategory => (
                    el.node.id === sub_subcategory.id &&
                    subcategory.handle !== "" ? (
                        <span>{' | '}
                            <span className="hover:underline hover:decoration-[#ff00a7] hover:text-[#ff00a7]">
                                <Link href={`/${category.handle}/${subcategory.handle}/${sub_subcategory.handle}`}>
                                    <a>
                                        {el.node.title}
                                    </a>
                                </Link>
                            </span>
                        </span>
                    ) : el.node.id === sub_subcategory.id && 
                        subcategory.handle === "" ? (
                        <span>{' | '}
                            <span className="hover:underline hover:decoration-[#ff00a7] hover:text-[#ff00a7]">
                                <Link href={`/${category.handle}/${sub_subcategory.handle}`}>
                                    <a>
                                        {el.node.title}
                                    </a>
                                </Link>
                            </span>
                        </span>
                    ) : null))
                ))
            ))
        ))
    }
    </div>
        </div>
      </div>
      </div>
    </div>
  )
}