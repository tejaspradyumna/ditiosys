import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Ditio Sys | Employee</title>
      </Head>
      <link rel="icon"
        href="https://www.ditiosys.com/wp-content/uploads/2020/09/cropped-image-removebg-preview-1-192x192.png"
        sizes="192x192"></link>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
