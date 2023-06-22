"use client"
import {Providers} from "./providers";

export default function RootLayout({children}) {
  return (
      <html lang="en">
      <head>
        <title>URL Shortener</title>
        <meta charSet="UTF-8"/>
        <meta name="description" content="Free URL shortener"/>
        <meta name="keywords" content="short url, shrturl, shorten url, url shortener, url short, short url, short"/>
        <meta name="author" content="Xignotic"/>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico"/>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
      </html>
  )
}
