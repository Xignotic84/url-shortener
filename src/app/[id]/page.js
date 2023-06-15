"use client"

import {useRouter} from "next/dist/client/compat/router";
import {getShortUrl} from "../../../services/urlFetcher";
import {Box} from "@chakra-ui/react";
import {useEffect} from "react";



export default async function Page({params}) {
  const router  = useRouter();

  useEffect(() => {
    //getShortUrl(params)

  })


  return (
      <>
        <Box>
          Test
        </Box>
      </>
  )
}
