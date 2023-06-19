"use client"

import InputField from "../components/InputField";

import {Box, Center, Heading, Text} from "@chakra-ui/react";
import URLTable from "../components/URLTable";
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';



export default function Home() {
  const [cookies, setCookie] = useCookies(['user-id']);

  useEffect(() => {
    console.log(cookies)
    const userId = cookies['user-id']

    if (!userId)
      setCookie('user-id', uuidv4())


  }, [cookies])

  return (
    <>
      <Box>
        <Center mt={100}>
          <Box>
            <Heading>
              Shorten your URL...
            </Heading>
            <Text mt={2}>
              Shorten your URL, fast and quickly...
            </Text>
          </Box>
        </Center>
        <InputField/>
        <URLTable/>
      </Box>
    </>
  )
}
