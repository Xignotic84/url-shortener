'use client'

import {Center, IconButton, Spinner, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import {useQuery, useQueryClient} from 'react-query'
import PreviousURL from "./PreviousURL";
import axios from "axios";
import {MdOutlineRefresh} from "react-icons/md";
import {useCookies} from "react-cookie";

export default function URLTable() {
  const queryClient = useQueryClient()
  const [cookies, setCookie] = useCookies(['user-id']);


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
            <Th>Creation Date</Th>
            <Th>Expires</Th>
            <Th display={'flex'} justifyContent={"flex-end"}>
              <IconButton onClick={() => queryClient.invalidateQueries("previousUrls")} aria-label={'Refresh'} icon={<MdOutlineRefresh/>}/>
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
