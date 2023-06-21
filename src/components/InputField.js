"use client"

import {IconButton, Input, Icon, Flex, Center, useToast, Menu, MenuButton, MenuList, MenuItem} from "@chakra-ui/react";
import {FaArrowRight, FaRegClock} from "react-icons/fa";
import {useMutation, useQueryClient} from "react-query"
import axios from 'axios'
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";


const menuOptions = [
    "1 Day",
    "1 Week",
    "30 Days",
    "1 Year",
    "5 Years",
    "Never"
]

export default function InputField() {
    const toast = useToast()
    const [input, setInput] = useState("")
    const [cookies, setCookie] = useCookies(['time-period', 'user-id']);
    const [timePeriod, setTimePeriod] = useState()

    const queryClient = useQueryClient()

    useEffect(() => {
        setTimePeriod(cookies['time-period'] || "Never")
    }, [cookies['time-period']])

    function setCurrentTimePeriod(period) {
        setCookie('time-period', period)
        setTimePeriod(period)
    }

    const {mutate, isLoading, isError} = useMutation(() => {
        return axios.post('/api/urls', {url: input, timePeriod}, {
            headers: {
                authorization: cookies['user-id']
            }
        })
    }, {
        onSuccess: (data) => {
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

            setTimeout(async () => {
                await queryClient.invalidateQueries("previousUrls")
            }, 500)

        },
        onError: (err) => {
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
        if (event.key === 'Enter') {
            mutate()
        }
    }

    function TimeSelector() {
        return <Menu borderRadius={8} w={'50%'}>
            <IconButton borderRadius={8} as={MenuButton} ml={2} icon={<Icon mt={1} as={FaRegClock}/>} aria-label={'Time period'}/>
            <MenuList bg={'blackAlpha.400'} w={'50%'}>
                {menuOptions.map((item, i) => {
                    return <MenuItem _hover={{ bg: timePeriod?.includes(item) ? '' : 'whiteAlpha.300' }}
                                     bg={timePeriod?.includes(item) && 'linear-gradient(135deg,#f08,#d0e)'} onClick={() => setCurrentTimePeriod(item)}
                                     key={i}>
                        {item}
                    </MenuItem>
                })}
            </MenuList>
        </Menu>
    }

    return <>
        <Center p={5}>
            <Flex>
                <Input variant={'solid'} borderRadius={8} isDisabled={isLoading} isInvalid={isError} w={'60vw'} placeholder='Your URL...'
                       onKeyPress={handleKeyPress} onChange={(val) => setInput(val.target.value)}/>
                <TimeSelector/>
                <IconButton  borderRadius={8} variant={'solid'} background={'accent'} isLoading={isLoading} ml={2} cursor={'pointer'} boxSize={10} aria-label={"Shorten"}
                            icon={<FaArrowRight/>} onClick={() => mutate()}/>
            </Flex>
        </Center>
    </>
}
