import Image from 'next/image'
import ProductForm from './ProductForm'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import RecommendedList from './RecommendedList'


export default function ProductPageContent({ product }) {

  const images = []

  product.images.edges.map((image, i) => {
    images.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image.node.originalSrc} atl={image.node.altText} width='600' height='855' layout="responsive" objectFit="cover" />
      </SwiperSlide>
    )
  })

  SwiperCore.use([Navigation, Pagination])



  return (
    <div>
      <div className="flex flex-col justify-center items-center md:px-6 space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-4 lg:space-x-8 md:max-w-6xl mx-auto">
        <div className="w-full md:max-w-md border bg-white md:rounded-2xl shadow-lg">
          <div className="w-full">
            <Swiper
            style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
            navigation
            pagination={{ clickable: true }}
            className="w-full md:rounded-2xl"
            loop="true"
          >
            {images}
          </Swiper>
          </div>
        </div>
        <ProductForm product={product} />
      </div>
      <p className="pt-16 space-y-8 md:space-x-4 lg:space-x-8 max-w-3xl w-11/12 mx-auto">{product.description}</p>
      <RecommendedList current={product.id} products={product.collections.edges[0].node.products.edges} />
    </div>
  )
}
