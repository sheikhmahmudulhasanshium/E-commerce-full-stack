import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function SetupLayout({
    children
}:{children:React.ReactNode}) {
    //extract userId from clerk
    const {userId}=auth()
    if(!userId){
        redirect('/sign-in')
    }
    const store=await prismadb.store.findFirst({
        where:{
            //userId:userId
            userId
        }
    })
    if(store){
        redirect(`/${store.id}`)
    }
    return(
        <>
            {children}
        </>
    )

}