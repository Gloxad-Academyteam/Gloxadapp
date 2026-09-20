import { useState } from "react"

const useModal = (ismodalopen: boolean)=>{
    const [isModalOpen, setisModalOpen] = useState(ismodalopen)

    const handleToggleModal = (modalState?: boolean)=>{
        if(modalState){
            return setisModalOpen(modalState)
        }

        setisModalOpen(!isModalOpen)
    }
    return {isModalOpen, handleToggleModal}
}

export default useModal
