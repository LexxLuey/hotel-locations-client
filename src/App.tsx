import {
  Route,
  Routes,
  Link as RouterLink
} from 'react-router-dom';
import { ChakraProvider, CSSReset, Box, Container, Heading, Link, Flex } from '@chakra-ui/react';
import Home from './pages/Home';
import HotelDetail from './pages/HotelDetail';
import CreateHotel from './pages/HotelCreate';
import HotelEdit from './pages/HotelEdit';
import HomeChain from './pages/HomeChain';
import HotelChainDetail from './pages/HotelChainDetail';
import HotelChainEdit from './pages/HotelChainEdit';
import HotelChainCreate from './pages/HotelChainCreate';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Box bg="gray.800" color="white" minHeight="100vh">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" p={4}>
            <Heading as="h1" size="lg">
              Hotel Guide
            </Heading>
            <nav>
              <Flex>
                <Link as={RouterLink} to="/" color="white" mr={4}>
                  Home
                </Link>
                <Link as={RouterLink} to="/chain" color="white" mr={4}>
                  View Chains
                </Link>
                <Link as={RouterLink} to="/create-hotel" color="white" mr={4}>
                  Create Hotel
                </Link>
                <Link as={RouterLink} to="/create-chain" color="white">
                  Create Hotel Chain
                </Link>
              </Flex>
            </nav>
          </Flex>
          <Routes>
            <Route path="/create-hotel" element={<CreateHotel/>} />
            <Route path="/edit-hotel/:id" element={<HotelEdit/>} />
            <Route path="/hotel/:id" element={<HotelDetail/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/create-chain" element={<HotelChainCreate/>} />
            <Route path="/edit-chain/:id" element={<HotelChainEdit/>} />
            <Route path="/chain/:id" element={<HotelChainDetail/>} />
            <Route path="/chain" element={<HomeChain/>} />
          </Routes>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
