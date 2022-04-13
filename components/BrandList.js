import ProductCard from "./ProductCard"
import Link from 'next/link'


const BrandList = ({ productsByBrand, brand, product }) => {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-3 px-4 lg:max-w-7xl">
        <div className="text-2xl pb-3 pl-1">{
          brand !== product.handle ?
          brand.toString().charAt(0).toUpperCase() + brand.toString().slice(1)
          : null
        }</div>
        <div className="flex flow-row text-sm pb-7 pl-1">
        <div>
            <Link href={'/'}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                Home
              </a>
            </Link>
          </div>
          &nbsp;
            {
              ' ' + '/' + ' '
            }
          &nbsp;
          <div>
            <Link href={`/shop-brands`}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                Brands
              </a>
            </Link>
          </div>
          &nbsp;
            {
              ' ' + '/' + ' '
            }
          &nbsp;
          <div className="font-semibold">
                {brand.toString().charAt(0).toUpperCase() + brand.toString().slice(1)}
          </div>
        </div>
         <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {
                productsByBrand.map(product => (
                    <ProductCard key={product.node.id} product={product}/>
                ))
            }
         </div>
        </div>
        </div>
  )
}

export default BrandList