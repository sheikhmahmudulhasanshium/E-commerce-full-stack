import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
//params is an object, that has storeId as string
export async function POST(req:Request,{params}:{params:{storeId:string}}) {
    try{
        //create store, based on the data we have
        const {userId}=auth()
        //in Store model id, createdAt,updatedAt are automatically decided and userId recieved from clerk
        const body=await req.json()
        //so we just need to handle name, destructure name from body
        const {label,imageUrl}=body

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401})
        }
        if(!label){
            return new NextResponse("Label is required",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("Image URL is required",{status:400})
        }

        if(!params.storeId){
            return new NextResponse("Store ID is required",{status:400})
        }

        //check this storeId belongs to this user
        const storeByUserId=await prismadb.store.findFirst({
                where:{
                    id:params.storeId,
                    userId,
                }
            }
        )
        //user is logged in but does not have permission to update other's billboard
        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status:403})
        }
        //if everything is available create billbooard
        const billboard=await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId,
            }
        })
        return NextResponse.json(billboard)
    }
    catch(error){
       console.log("[BILLBOARDS_POST]",error) 
       return new NextResponse("Internal error",{status:500})
    }
}


export async function GET(req:Request,{params}:{params:{storeId:string}}) {
    try{
        
        if(!params.storeId){
            return new NextResponse("Store ID is required",{status:400})
        }

       
        
        const billboards=await prismadb.billboard.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboards)
    }
    catch(error){
       console.log("[BILLBOARDS_GET]",error) 
       return new NextResponse("Internal error",{status:500})
    }
}