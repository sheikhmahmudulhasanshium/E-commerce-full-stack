"use client"

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ModalProps{
    title:string,
    description:string,
    isOpen:boolean,
    //onclose function
    onClose: ()=>void,
    children?:React.ReactNode,
}
export const Modal:React.FC<ModalProps>=({title,description,isOpen,onClose,children})=>{
    //onChange will collect open props and check either true or false
    const onChange=(open:boolean)=>{
        if(!open){
            onClose()
        }
    }
    return(
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}