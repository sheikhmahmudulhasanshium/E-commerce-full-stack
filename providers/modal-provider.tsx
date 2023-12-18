"use client"
import { StoreModal } from "@/components/modals/store-modal"

import { useEffect,useState } from "react"

export const ModalProvider=()=>{
    const [isMounted, setIsMounted]=useState(false)
    useEffect(
        ()=>{
            setIsMounted(true)
        },[]//dependency array
        )
        //if i am in server side rendering  it will return null so that hydration error is not triggered
        if(!isMounted){
            return null
        }

        //if i am in client-side
    return(
        <StoreModal/>
    )
}