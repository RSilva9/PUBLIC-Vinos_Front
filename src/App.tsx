import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginMenu from "./components/LoginMenu";
import { SiteContextProvider } from "./components/_siteContext"
import NavBar from "./components/NavBar";
import StartMenu from "./components/StartMenu";
import Clients from "./components/Clients";
import Suppliers from "./components/Suppliers";
import Sales from "./components/Sales";
import Purchases from "./components/Purchases";
import Users from "./components/Users";
import Products from "./components/Products";
import Stock from "./components/Stock";
import Mailing from "./components/Mailing";
import Charts from "./components/Charts";
import { ThemeProvider } from "./components/themeContext";
import Deposits from "./components/Deposits";

export function App() {
  return (
    <div className="app">
      <SiteContextProvider>
      <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <LoginMenu />
          }/>
          <Route path='/*' element={
            <>
              <NavBar />
              <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased min-h-screen">
                  <div className="pt-15">
                    <Routes>
                      <Route path='/inicio' element={
                        <StartMenu />
                      }/>
                      <Route path='/usuarios' element={
                        <Users />
                      }/>
                      <Route path='/clientes' element={
                        <Clients />
                      }/>
                      <Route path='/proveedores' element={
                        <Suppliers />
                      }/>
                      <Route path='/ventas' element={
                        <Sales />
                      }/>
                      <Route path='/compras' element={
                        <Purchases />
                      }/>
                      <Route path='/productos' element={
                        <Products />
                      }/>
                      <Route path='/depositos' element={
                        <Deposits />
                      }/>
                      <Route path='/stock' element={
                        <Stock />
                      }/>
                      <Route path='/mensajeria' element={
                        <Mailing />
                      }/>
                      <Route path='/tablas' element={
                        <Charts />
                      }/>
                    </Routes>
                  </div>
                </div>
              </>
          }/>
          </Routes>
      </BrowserRouter>
      </ThemeProvider>
      </SiteContextProvider>
    </div>
  );
}

export default App;
