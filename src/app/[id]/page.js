"use client"
import {useParams, useRouter, redirect} from 'next/navigation'
import {useEffect, useState} from "react";
import {Box, Center, Spinner, useToast} from "@chakra-ui/react";
import axios from "axios";


export default function Home() {
  const { id } = useParams()
  const router = useRouter()
  const toast = useToast()


  useEffect(async () => {
    if (id !== undefined) {

      const res = await axios.get(`/api/url/${id}`).then(r => r.data)

      if (new Date().getTime() > new Date(res.expirationDate).getTime()) {
        toast({
          title: 'URL Expired',
          position: 'bottom',
          containerStyle: {
            marginBottom: "15px"
          },
          variant: 'subtle',
          description: "Oops, looks like that URL is expired. Redirecting you...",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })

        setTimeout(() => {
          window.location = "/"
        }, 2000)
        return () => {};

      }

      if (res) {
        window.location = res.url.includes('https://') ? res.url : (`https://${res.url}`)
      } else {
        window.location = "/"
      }

      return () => {};
    }
  }, [id])

  return (
      <Center mt={400}>
        <Spinner size={'xl'}/>
      </Center>
  )
}
