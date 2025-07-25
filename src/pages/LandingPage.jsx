import React from 'react'
import { Map } from 'lucide-react'
import { useNavigate } from 'react-router'

import logo from '../assets/react.svg'
import macmockup from '../assets/image/mac16-mockup.png'

function LandingPage() {
  const navigate = useNavigate()

  const handleExploreClick = () => {
    navigate('/mapview')
  }


  return (
    <main className="landing-page  min-h-1/2 p-6 ">
      <header className="text-gray-600 body-font">
        <div className=" flex  flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src={logo} alt="Logo Image" className='size-10' />
            <span className="ml-3 text-xl">Logo</span>
          </a>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap space-x-8 items-center text-lg font-popReg justify-center">
            <a>About</a>
            <a>How it works</a>
            <a>Features</a>
            <a>Community</a>
            <a>Stories</a>
          </nav>
          <button onClick={handleExploreClick} className="primarybtn flex justify-center items-center  space-x-3 py-2 px-4  rounded font-popReg text-white ">
            <span>  View map</span> 
              
          </button>
        </div>
      </header>
      <section>
        <div className="container mx-auto flex px-5 py-32 items-center justify-center flex-col space-y-6">
          <div className="text-center sm:text-7xl text-3xl lg:w-2/3 w-full space-y-2">
            <h1 className=" font-popSmBld ">
              Insightful 
              <span className='font-popReg'> Views </span>
              
            </h1>
            <h1 className=" font-popSmBld text-greenie ">
              Purposeful  
              <span className='text-allBlack'> Steps </span>
              
            </h1>
            <p className="font-popReg text-lg leading-relaxed mt-6">From sky-level vision to steps that turn insight into action</p>
          </div>
            <div className=" font-popMd text-white">
              <button onClick={handleExploreClick} className="primarybtn flex justify-center items-center  space-x-3 py-2 px-4  rounded text-lg">
              <Map size={20} />
              <span>  Start exploring</span> 
                
              </button>
            </div>
        <img src={macmockup} className='size-'/>
        </div>

      </section>
      <section className='mx-auto w-full  flex justify-center items-center'>
      </section>
      
    </main>
    
  )
}

export default LandingPage