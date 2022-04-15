import { useState, useContext, useEffect } from "react"
import { formatter } from "../utils/helpers"
import ProductOptions from "./ProductOptions"
import { CartContext } from '../context/shopContext'
import useSWR from "swr"
import axios from "axios"
import Head from 'next/head'
import Link from "next/link"
import collections from "../categories"


const fetcher = (url, id) => (
    axios.get(url, {
        params: {
            id: id
        }
    }).then((res) => res.data)
)

export default function ProductForm({ product }) {

    const categories = collections
    console.log(categories)

    const { data: productInventory } = useSWR(
        ['/api/available', product.handle],
        (url, id) => fetcher(url, id), 
        { errorRetryCount: 3 }
    )

    const [available, setAvailable] = useState(true)

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

    const [selectedVariant, setSelectedVariant] = useState(allVariantOptions[0])
    const [selectedOptions, setSelectedOptions] = useState(defaultValues)
    const [counter, setCounter] = useState(1);
    

    function setOptions(name, value) {
        setSelectedOptions(prevState => {
            return { ...prevState, [name]: value }
        })

        const selection = {
            ...selectedOptions, 
            [name]: value
        }

        allVariantOptions.map(item => {
            if (JSON.stringify(item.options) === JSON.stringify(selection)) {
                setSelectedVariant(item)
                setCounter(1)
            }
        })
    }

    const increment = () => {
        counter < 9 ? counter += 1 : null
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
        counter > 1 ? counter -= 1 : null
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

    useEffect(() => {
        if (productInventory) {
            const checkAvailable = productInventory?.variants.edges.filter(item => item.node.id === selectedVariant.id)

            if (checkAvailable[0].node.availableForSale) {
                setAvailable(true)
            } else {
                setAvailable(false)
            }
        }
    }, [productInventory, selectedVariant])

    let tracker = []
  return (
    <div className="rounded-2xl p-4 relative -top-4 md:top-0 shadow-lg flex flex-col w-11/12 md:w-[390px]">
        <Head>
            <script type='text/javascript' id={product.id}>
                {
                    `for (let button of document.querySelectorAll(".selectSection button")) {

                        let allContent = document.querySelectorAll('.content');
                
                        for (let content of allContent) {
                            allContent[0].classList.add('toggled');
                        }
                
                        let chevrons = document.querySelectorAll(".chevron");
                        let minuses = document.querySelectorAll(".minus");
                
                        for (let minus of minuses) {
                            minuses[0].classList.add('toggled');
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
                                if (content.getAttribute('data-number') === button.getAttribute('data-number')) {
                                    content.classList.toggle('toggled');
                                }
                
                                else if (content.getAttribute('data-number') !== button.getAttribute('data-number')) {
                                    content.classList.remove('toggled');
                                }
                            }
                        });
                        }
                `}
            </script>
        </Head>
      <h2 className="text-2xl font-bold">{product.title}</h2>
      <span className="pb-3 text-xl">{formatter.format(product.variants.edges[0].node.priceV2.amount)}</span>
      {
          product.options.map(({ name, values }) => (
              <ProductOptions 
              key={`key-${name}`}
              name={name}
              values={values}
              selectedOptions={selectedOptions}
              setOptions={setOptions}
              selectedVariant={selectedVariant}
              productInventory={productInventory}
              available={available}
              />
          ))
      }
      <legend className='text-xl font-semibold mt-6'>Qty</legend>
       <div className="shadow-md rounded-lg inline-block my-2 xxs:w-[142.5px] xs:!w-[142px]">
        <button 
        onClick={decrement}
        className='text-black highlight-removal transition-all ease-in-out duration-100 px-3 rounded-l-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
          &mdash;
        </button>
        
        <input id="input" inputMode='numeric' pattern="[0-9]*" onFocus={(e) => e.target.value = ""} onBlur={(e) => e.target.value = counter} className="text-black transition-all ease-in-out duration-100 relative focus:outline-2 outline-blue-400 caret-indigo-400 text-center rounded-none w-16 py-1" type="text"  value={counter} onChange={handleChange} />
        
        <button 
        onClick={increment}
        className='text-black highlight-removal transition-all ease-in-out duration-100 px-3 rounded-r-lg py-1 font-semibold hover:bg-gray-200 active:bg-black active:text-white'>
          &#xff0b;
        </button>  
      </div>   
      {
          available ?
          <button 
          onClick={() => {
              addToCart(selectedVariant)
              setCounter(1)
          }}
          className="transition-all ease-in-out duration-400 font-bold bg-amber-300 rounded-lg text-black px-2 py-3 mt-8 hover:bg-amber-400">Add to Cart</button> 
          :
          <button 
          className="bg-gray-800 rounded-lg text-white px-2 py-3 mt-8 cursor-not-allowed">SOLD OUT!</button>
      }
    <div className="mt-6">
    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}></div>
    {
    product.collections.edges.map(el => (
        categories.map(category => (
            el.node.id === category.id ? (
                <span>
                    <Link href={`/${category.handle}`}>
                        <a>
                            {el.node.title}
                        </a>
                    </Link>
                    {tracker.push(el.node.title)}
                    {tracker.length > 1 ? ' | ' : null}
                    {console.log(product.collections.edges.map(el => el))}
                </span>
            ) : category.subcollections?.map(subcategory => (
                el.node.id === subcategory.id ? (
                    <span>
                        <Link href={`/${category.handle}/${subcategory.handle}`}>
                            <a>
                                {el.node.title}
                            </a>
                        </Link>
                        {tracker.push(el.node.title)}
                        {tracker.length > 2 ? ' | ' : null}
                    </span>
                ) : subcategory.sub_subcollections?.map(sub_subcategory => (
                    el.node.id === sub_subcategory.id &&
                    subcategory.handle !== "" ? (
                        <span>
                            <Link href={`/${category.handle}/${subcategory.handle}/${sub_subcategory.handle}`}>
                                <a>
                                    {el.node.title}
                                </a>
                            </Link>
                        </span>
                    ) : el.node.id === sub_subcategory.id && 
                        subcategory.handle === "" ? (
                        <span>
                            <Link href={`/${category.handle}/${sub_subcategory.handle}`}>
                                <a>
                                    {el.node.title}
                                </a>
                            </Link>
                        </span>
                    ) : null))
                ))
            ))
        ))
    }
      </div>
    </div>
  )
}