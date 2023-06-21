import {Flex, IconButton, Tag, Td, Tr, useMediaQuery, useToast} from "@chakra-ui/react";

import ms from 'ms'
import {FaRegCopy, FaRegThumbsUp, FaRegTrashAlt} from "react-icons/fa";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function PreviousURL({data}) {
  const [cookies, setCookie] = useCookies(['current-time-period', 'user-id']);
  const router = useRouter()
  const [hasCopied, setHasCopied] = useState()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 800px)")


  function setCopyValue() {
    navigator.clipboard.writeText(`${window.location.href}${data.shortUrl}`)
    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, 800)
  }

  const {mutate, isLoading} = useMutation((id) => {
    return axios.delete(`/api/urls?id=${id}`, {
      headers: {
        authorization: cookies['user-id']
      }
    })
  }, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("previousUrls")

      toast({
        title: 'URL Deleted',
        position: 'bottom',
        containerStyle: {
          marginBottom: "15px"
        },
        variant: 'subtle',
        description: "We've deleted your URL.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
    onError: (err) => {
      toast({
        title: 'Failed to Delete URL',
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

  const isExpired = new Date().getTime() > new Date(data.expirationDate).getTime()
  return <Tr onClick={() => window.open(`/${data.shortUrl}`, '_blank')}
             transition="all .25s ease"
             cursor={'pointer'}
             _hover={{transform: 'scale(0.997)', filter: "brightness(90%)",}}
             background={isExpired ? 'blackAlpha.400' : 'blackAlpha.200'}>
    <Td>
      <Tag colorScheme={isExpired ? 'red' : 'green'}>
        /{data.shortUrl}
      </Tag>
    </Td>
    <Td>
      <Tag>
        {data.url}
      </Tag>
    </Td>
    {!isMobile && <>
      <Td>
        {ms(new Date().getTime() - new Date(data.createdTimestamp).getTime(), {long: true})} ago
      </Td>
      <Td>
        {ms(new Date(data.expirationDate).getTime() - new Date().getTime(), {long: true})}
      </Td>
    </>}


    <Td>
      <Flex justifyContent={'flex-end'} gap={2}>
        <IconButton borderRadius={8} cursor={'pointer'} isDisabled={isExpired} icon={hasCopied ? <FaRegThumbsUp/> : <FaRegCopy/>} onClick={(e) => {
          e.stopPropagation()
          setCopyValue()
        }} aria-label={"Copy"}/>
        <IconButton borderRadius={8} _hover={{background: 'red.400'}} onClick={(e) => {
          e.stopPropagation()
          mutate(data.shortUrl)
        }} icon={<FaRegTrashAlt/>} aria-label={"Delete"}/>
      </Flex>
    </Td>
  </Tr>
}
