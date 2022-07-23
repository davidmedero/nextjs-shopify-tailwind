import '../styles/globals.css'
import '../styles/styles.css'
import 'tailwindcss/tailwind.css'
import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import "swiper/css/free-mode"
import Layout from '../components/Layout'
import ShopProvider from '../context/shopContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import Router from 'next/router'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })
import React from 'react'


function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const router = useRouter()

  if (typeof window === "undefined") React.useLayoutEffect = () => {}

  Router.events.on('routeChangeStart', (url) => {
    NProgress.start()
  })

  Router.events.on('routeChangeComplete', (url) => {
    NProgress.done()
  })
  
  return (
    <>
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
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
