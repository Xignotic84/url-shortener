'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {theme} from "../../theme/theme";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

export function Providers({ children }) {
  const queryClient = new QueryClient()

  return (
      <CacheProvider>
        <ChakraProvider theme={extendTheme(theme)}>
          <QueryClientProvider client={queryClient}>

          {children}
          </QueryClientProvider>

        </ChakraProvider>
      </CacheProvider>
  )
}
