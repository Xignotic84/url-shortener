"use client"

import InputField from "../components/InputField";

import {Box, Center, Heading, Text} from "@chakra-ui/react";
import URLTable from "../components/URLTable";

export default function Home() {
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
