'use client'

import {
  Center, chakra,
  IconButton,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Icon,
  Th,
  Thead,
  Tr,
  shouldForwardProp,
  useMediaQuery
} from "@chakra-ui/react";
import {useQuery, useQueryClient} from 'react-query'
import PreviousURL from "./PreviousURL";
import axios from "axios";
import {MdOutlineRefresh} from "react-icons/md";
import {useCookies} from "react-cookie";
import {isValidMotionProp, motion} from "framer-motion";

export default function URLTable() {
  const queryClient = useQueryClient()
  const [cookies, setCookie] = useCookies(['user-id']);
  const [isMobile] = useMediaQuery("(max-width: 800px)")

  const ChakraBox = chakra(motion.div, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });

  const {isLoading, isError, data, error} = useQuery('previousUrls', async () => {
    return axios.get("/api/urls", {
      headers: {
        authorization: cookies['user-id']
      }
    }).then(r => r.data)
  })

  return <Center>
    <TableContainer w={'70rem'}>
      <Table size={'sm'} style={{borderCollapse: "separate", borderSpacing: "0 1em"}} variant='simple'>
        <Thead>
          <Tr>
            <Th>Short URL</Th>
            <Th>Original URL</Th>
            {!isMobile && <>
              <Th>Creation Date</Th>
              <Th>Expires</Th>
            </>}
            <Th display={'flex'} justifyContent={"flex-end"}>
              <ChakraBox
                  whileHover={{scale: 0.9, rotate: 45}}
                  whileTap={{
                    scale: 0.9,
                    rotate: 340,
                    borderRadius: "100%",
                  }}

                  transition={{ duration: 0.3 }}

              >
                <IconButton borderRadius={8} isLoading={isLoading}
                            onClick={() => queryClient.invalidateQueries("previousUrls")} aria-label={'Refresh'}
                            icon={<Icon boxSize={5} as={MdOutlineRefresh}/>}/>
              </ChakraBox>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isError && !isLoading && data?.previousUrls?.sort((a, b) => new Date(b.createdTimestamp) - new Date(a.createdTimestamp)).map((d, i) => {
            return <PreviousURL key={i} data={d}/>
          })}
        </Tbody>
      </Table>
      {isLoading && <Center mt={100}>
        <Spinner size={'lg'}/>
      </Center>}
      {isError && <Center mt={100}>
        <Spinner size={'lg'}/>
      </Center>}
    </TableContainer>
  </Center>
}
