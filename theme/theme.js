import { mode } from "@chakra-ui/theme-tools";


export const theme = {
  config: {
    initialColorMode: 'dark',
  },
  styles: {
    global: (props) => ({
      body: {
        fontFamily: 'Montserrat, sans-serif',
        background: "hsl(0, 0%, 10%)",
        color: 'hsl(0, 0%, 100%)',
        backgroundRepeat: 'no-repeat',
        height: '100%'
      },
    })
  },
  colors: {
    accent: '#b8f',
  }
}
