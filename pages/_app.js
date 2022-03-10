import '../styles/globals.css'
import '../styles/styles.css'
import 'tailwindcss/tailwind.css'
import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Layout from '../components/Layout'
import ShopProvider from '../context/shopContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  
  return (
    <>
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </Head>
    <ShopProvider>
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
      </SessionProvider>
    </ShopProvider>
    </>
  )
}

export default MyApp
