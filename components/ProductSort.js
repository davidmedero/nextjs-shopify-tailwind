import { useState } from "react"


export default function ProductSort() {

    const [sort, setSort] = useState('Best Sellers')

    const [showSortOptions, setShowSortOptions] = useState(false)

    return (
        <div>
            <div 
            onMouseOver={() => setShowSortOptions(true)}
            onMouseLeave={() => setShowSortOptions(false)}>
                <span className="border-2 p-1 pl-3 flex w-[200px] items-center justify-between">
                    <span className="select-none">SORT</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                </span>
                {
                    showSortOptions && (
                        <div className='absolute z-50 whitespace-nowrap bg-white'>
                            <div className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Best Sellers</div>
                            <div className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Newest</div>
                            <div className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Highest Price</div>
                            <div className='w-[200px] p-3 hover:bg-pink-100 cursor-pointer'>Lowest Price</div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}