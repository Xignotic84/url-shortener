"use client"

import {IconButton, Input, Icon, Flex, Center, useToast, Menu, MenuButton, MenuList, MenuItem} from "@chakra-ui/react";
import {FaArrowRight, FaRegClock} from "react-icons/fa";
import {useMutation, useQueryClient} from "react-query"
import axios from 'axios'
import {useState} from "react";

const menuOptions = [
    "1 Day",
    "1 Week",
    "1 Month",
    "1 Year",
    "5 Years",
    "10 Years",
    "Never"
]

export default function InputField() {
  const toast = useToast()
  const [input, setInput] = useState("")
  const [timePeriod, setTimePeriod] = useState(menuOptions.slice(-1)[0])
  const queryClient = useQueryClient()

  const {mutate, isLoading, isError} = useMutation(() => {
    return axios.post('/api/urls', {url: input, timePeriod})
  }, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("previousUrls")

      toast({
        title: 'URL Shortened',
        position: 'bottom',
        containerStyle: {
          marginBottom: "15px"
        },
        variant: 'subtle',
        description: "We've shortened your URL for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
    onError: (err) => {``
      toast({
        title: 'Failed to Shorten URL',
        position: 'bottom',
        containerStyle: {
          marginBottom: "15px"
        },
        variant: 'subtle',
        description: err.response.data.message || "Something went wrong",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  })

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      mutate()
    }
  }

  function TimeSelector() {
    return <Menu>
      <IconButton as={MenuButton} ml={2} icon={<FaRegClock/>} aria-label={'Time period'}/>
      <MenuList>
        {menuOptions.map((item, i) => {
          console.log(timePeriod, item)
          return <MenuItem isActive={true} onClick={() => setTimePeriod(item)} key={i}>
            {item}
          </MenuItem>
        })}
      </MenuList>
    </Menu>
  }

  return <>
    <Center p={5}>
      <Flex>
        <Input isDisabled={isLoading} isInvalid={isError} w={'60rem'} placeholder='Your URL...' onKeyPress={handleKeyPress} onChange={(val) => setInput(val.target.value)}/>
        <TimeSelector/>
        <IconButton isLoading={isLoading} ml={2} cursor={'pointer'} boxSize={10} aria-label={"Shorten"} icon={<FaArrowRight/>} onClick={() => mutate()}/>
      </Flex>
    </Center>
  </>
}
