"use client"

import InputField from "../components/InputField";

import {Box, Center, Flex, Heading, Text} from "@chakra-ui/react";
import URLTable from "../components/URLTable";
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';



export default function Home() {
  const [cookies, setCookie] = useCookies(['user-id']);

  useEffect(() => {
    const userId = cookies['user-id']

    if (!userId)
      setCookie('user-id', uuidv4(), {
        path: '/',
        maxAge: 94608000
      })


  }, [cookies])

  return (
    <>
      <Box>
        <Center mt={100}>
          <Flex>
            <Heading>
              Shorten your
            </Heading>
            <Heading ml={2} bg={'linear-gradient(135deg,#f08,#d0e)'} backgroundClip={'text'}>URL...</Heading>
          </Flex>
        </Center>
        <InputField/>
        <URLTable/>
      </Box>
    </>
  )
}
