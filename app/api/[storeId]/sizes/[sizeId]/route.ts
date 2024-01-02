import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function PATCH(req:Request,{params}:{params:{storeId:string,sizeId:string}}) {
    try{
        const {userId}=auth()
        const body=await req.json()
        const {name,value}=body
        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        if(!name){
            return new NextResponse("Name is Required",{status:400})
        }
        if(!value){
            return new NextResponse("Value is Required",{status:400})
        }
        if(!params.sizeId){
            return new NextResponse("Size ID is reuired",{status:400})
        }

        //try and fetch the current store
        //check this storeId belongs to this user
        const storeByUserId=await prismadb.store.findFirst({
            where:{
                    id:params.storeId,
                    userId
                }
            }
            )
        //user is logged in but does not have permission to update other's size
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }
        const size=await prismadb.size.update({
            where:{
                id:params.sizeId,
            },
            data:{
                name,
                value,
            }
        })
        return NextResponse.json(size)
    }
    catch(error){
        console.log("[SIZE_PATCH]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}



//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function DELETE(req:Request,{params}:{params:{storeId:string,sizeId:string}}) {
    try{
        const {userId}=auth()
        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        
        if(!params.sizeId){
            return new NextResponse("Size ID is reuired",{status:400})
        }

        //try and fetch the current store
        //check this storeId belongs to this user
        const storeByUserId=await prismadb.store.findFirst({
            where:{
                    id:params.storeId,
                    userId
                }
            }
            )
        //user is logged in but does not have permission to update other's size
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }

        const size=await prismadb.size.delete({
            where:{
                id:params.sizeId,
            
            },
            
        })
        return NextResponse.json(size)
    }
    catch(error){
        console.log("[SIZE_DELETE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}


export async function GET(req:Request,{params}:{params:{sizeId:string}}) {
    try{
        
        if(!params.sizeId){
            return new NextResponse("Size ID is reuired",{status:400})
        }
        const size=await prismadb.size.findUnique({
            where:{
                id:params.sizeId,
            
            },
            
        })
        return NextResponse.json(size)
    }
    catch(error){
        console.log("[SIZE_GET]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}