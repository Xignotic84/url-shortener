'use client'

import {Center, Spinner, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import {useQuery} from 'react-query'
import PreviousURL from "./PreviousURL";
import axios from "axios";

export default function URLTable() {

  const {isLoading, isError, data, error} = useQuery('previousUrls', async () => {
    return axios.get("/api/urls").then(r => r.data)
  })

  return <Center>
    <TableContainer w={'70rem'}>
      <Table size={'sm'} style={{borderCollapse: "separate", borderSpacing: "0 1em"}} variant='simple'>
        <Thead>
          <Tr>
            <Th>Short URL</Th>
            <Th>Original URL</Th>
            <Th>Creation Date</Th>
            <Th/>
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
