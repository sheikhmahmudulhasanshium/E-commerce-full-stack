import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    try{
        //create store, based on the data we have
        const {userId}=auth()
        //in Store model id, createdAt,updatedAt are automatically decided and userId recieved from clerk
        const body=await req.json()
        //so we just need to handle name, destructure name from body
        const {name}=body

        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }
        if(!name){
            return new NextResponse("Name is required",{status:400})
        }
        //if everything is available create store
        const store=await prismadb.store.create({
            data:{
                name,
                userId,
            }
        })
        return NextResponse.json(store)
    }
    catch(error){
       console.log("[STORES_POST]",error) 
       return new NextResponse("Internal error",{status:500})
    }
}