import Link from 'next/link'
import brands from '../brands'

const ShopBrands = () => {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-3 px-4 lg:max-w-7xl">
        <div className="text-2xl pb-3 pl-1">BRANDS</div>
        <div className="flex flex-col text-sm pb-7 pl-1">
          {
            brands.map(el => (
              el.subcollections.map(brand => (
                <Link href={`/shop/${brand.handle}`}>
                  <a className='hover:bg-pink-100'>
                    {brand.title}
                  </a>
                </Link>   
                 ))
             ))
         }
        </div>
      </div>
    </div>
  )
}

export default ShopBrands