import {Flex, IconButton, SlideFade, Tag, Td, Tr, useClipboard, useMediaQuery, useToast} from "@chakra-ui/react";

import ms from 'ms'
import {FaRegCopy, FaRegThumbsUp, FaRegTrashAlt} from "react-icons/fa";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";

export default function PreviousURL({data}) {
  const [cookies, setCookie] = useCookies(['current-time-period']);
  const router = useRouter()
  const {hasCopied} = useClipboard("");
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isMobile] = useMediaQuery("(max-width: 800px)")


  function setCopyValue() {
    navigator.clipboard.writeText(`${window.location.href}${data.shortUrl}`)
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
             _hover={{transform: 'scale(0.99)', filter: "brightness(90%)",}}
             background={isExpired ? 'blackAlpha.400' : 'blackAlpha.200'}>
    <Td>
      <Tag colorScheme={'green'}>
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
        <IconButton isDisabled={isExpired} icon={hasCopied ? <FaRegThumbsUp/> : <FaRegCopy/>} onClick={(e) => {
          e.stopPropagation()
          setCopyValue()
        }} aria-label={"Copy"}/>
        <IconButton onClick={(e) => {
          e.stopPropagation()

          mutate(data.shortUrl)
        }} icon={<FaRegTrashAlt/>} aria-label={"Delete"}/>
      </Flex>
    </Td>
  </Tr>
}
