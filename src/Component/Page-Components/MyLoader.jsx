import React from 'react'
import { TailSpin } from 'react-loader-spinner'
const MyLoader = () => {
  return (
    <TailSpin
  visible={true}
  height="80"
  width="80"
  color="#0077b6"
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  />
  )
}

export default MyLoader