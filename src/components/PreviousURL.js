import {Flex, IconButton, SlideFade, Tag, Td, Tr, useClipboard, useToast} from "@chakra-ui/react";

import ms from 'ms'
import {FaRegCopy, FaRegThumbsUp, FaRegTrashAlt} from "react-icons/fa";
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";

export default function PreviousURL({data}) {
  const {onCopy, value, setValue, hasCopied} = useClipboard("");
  const queryClient = useQueryClient()
  const toast = useToast()


  const {mutate, isLoading} = useMutation((id) => {
    return axios.delete(`/api/urls?id=${id}`)
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

  return <Tr background={'blackAlpha.200'}>
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
    <Td>{ms(new Date().getTime() - new Date(data.createdTimestamp).getTime(), {long: true})} ago</Td>
    <Td>
      <Flex justifyContent={'flex-end'} gap={2}>
        <IconButton icon={hasCopied ? <FaRegThumbsUp/> : <FaRegCopy/>} onClick={() => {
          setValue(`${window.location.href}${data.shortUrl}`)
          onCopy()
        }} aria-label={"Copy"}/>
        <IconButton onClick={() => {
          mutate(data.shortUrl)
        }} icon={<FaRegTrashAlt/>} aria-label={"Delete"}/>
      </Flex>
    </Td>
  </Tr>
}
