import ProductCard from "./ProductCard"
import Link from 'next/link'


const SubcategoryList = ({ productsBySubcollection, category, subcategory, product }) => {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-3 px-4 lg:max-w-7xl">
        <div className="text-2xl pb-3 pl-1">{
          subcategory !== product.handle ?
          subcategory.toString().charAt(0).toUpperCase() + subcategory.toString().slice(1)
          : null
        }</div>
        <div className="flex flow-row text-sm pb-7 pl-1">
          <div>
            <Link href={`/${category}`}>
              <a className="hover:underline text-[#8d8d8d] font-semibold">
                {category.toString().charAt(0).toUpperCase() + category.toString().slice(1)}
              </a>
            </Link>
          </div>
          &nbsp;
            {
              ' ' + '/' + ' '
            }
          &nbsp;
          <div className="font-semibold">
                {subcategory.toString().charAt(0).toUpperCase() + subcategory.toString().slice(1)}
          </div>
        </div>
         <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {
                productsBySubcollection.map(product => (
                    <ProductCard key={product.node.id} product={product}/>
                ))
            }
         </div>
        </div>
        </div>
  )
}

export default SubcategoryList