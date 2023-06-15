import { mode } from "@chakra-ui/theme-tools";


export const theme = {
  config: {
    initialColorMode: 'light',
  },
  styles: {
    global: (props) => ({
      body: {
        background: "white",
        color: 'black',
      },
    })
  },
  colors: {
    background: {
      primary: '#030303',
      secondary: '#2C302E'
    },
  }
}
