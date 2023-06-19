"use client"
import {useParams, useRouter, redirect} from 'next/navigation'
import {useEffect, useState} from "react";
import {Box} from "@chakra-ui/react";
import axios from "axios";


export default function Home() {
  const { id } = useParams()
  const router = useRouter()

  useEffect(async () => {
    if (id !== undefined) {

      const res = await axios.get(`/api/url/${id}`).then(r => r.data)

      if (res) {
        window.location = res.url.includes('https://') ? res.url : (`https://${res.url}`)
      } else {
        window.location = "/"
      }

      return () => {};
    }
  }, [id])

  return (
      <Box/>
  )
}
