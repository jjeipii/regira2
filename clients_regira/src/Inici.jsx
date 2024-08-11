import { useState } from 'react'
import {Sorts} from './IndexSorts/Sorts'
import Login from './LoginAndRegister/Login'
import Register from './LoginAndRegister/Register'

export default () => {
  const [lr, setLr] = useState(false)

  return (
    <div className='flex h-full'>
      <div className='bg-white w-3/5  flex items-center justify-center'>
        <Sorts/> 
      </div>
      <div className='bg-neutral-800  w-2/5  flex items-center justify-center'>
        {lr === false ? <Login registerOn={setLr}/> : <Register registerOn={setLr}/>}
      </div>
    </div>
  )
}