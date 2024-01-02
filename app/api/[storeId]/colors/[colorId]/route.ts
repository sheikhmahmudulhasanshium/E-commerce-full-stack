import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function PATCH(req:Request,{params}:{params:{storeId:string,colorId:string}}) {
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
        if(!params.colorId){
            return new NextResponse("Color ID is reuired",{status:400})
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
        //user is logged in but does not have permission to update other's color
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }
        const color=await prismadb.color.update({
            where:{
                id:params.colorId,
            },
            data:{
                name,
                value,
            }
        })
        return NextResponse.json(color)
    }
    catch(error){
        console.log("[COLOR_PATCH]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}



//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function DELETE(req:Request,{params}:{params:{storeId:string,colorId:string}}) {
    try{
        const {userId}=auth()
        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        
        if(!params.colorId){
            return new NextResponse("Color ID is reuired",{status:400})
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
        //user is logged in but does not have permission to update other's color
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }

        const color=await prismadb.color.delete({
            where:{
                id:params.colorId,
            
            },
            
        })
        return NextResponse.json(color)
    }
    catch(error){
        console.log("[COLOR_DELETE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}


export async function GET(req:Request,{params}:{params:{colorId:string}}) {
    try{
        
        if(!params.colorId){
            return new NextResponse("Color ID is reuired",{status:400})
        }
        const color=await prismadb.color.findUnique({
            where:{
                id:params.colorId,
            
            },
            
        })
        return NextResponse.json(color)
    }
    catch(error){
        console.log("[COLOR_GET]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}