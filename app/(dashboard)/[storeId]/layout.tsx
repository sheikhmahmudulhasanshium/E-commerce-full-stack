import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
//paramsare a kind of object that stores  storeId
export default async function DashboardLayout({
    children,params}:{
        children:React.ReactNode,
         params:{storeId:string}}) {
    //check if user is logged-in
    const {userId}=auth()
    if(!userId){
        redirect("/sign-in")
    }
    //if user has user id, storeId can be fetched
    const store =await prismadb.store.findFirst({
        where:{
            id:params.storeId,
            //userId:userId shorthand
            userId,
        }
    })
    if(!store){
        redirect("/")
    }
    return(
        <>
            <Navbar/>
            {children}
        </>
    )
}