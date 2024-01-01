import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function PATCH(req:Request,{params}:{params:{storeId:string,billboardId:string}}) {
    try{
        const {userId}=auth()
        const body=await req.json()
        const {label,imageUrl}=body
        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        if(!label){
            return new NextResponse("Label is Required",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("Image URL is Required",{status:400})
        }
        if(!params.billboardId){
            return new NextResponse("Billboard ID is reuired",{status:400})
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
        //user is logged in but does not have permission to update other's billboard
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }
        const billboard=await prismadb.billboard.update({
            where:{
                id:params.billboardId,
            },
            data:{
                label,
                imageUrl,
            }
        })
        return NextResponse.json(billboard)
    }
    catch(error){
        console.log("[BILLBOARD_PATCH]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}



//this will target individual store
//even though the req is not used the params should be in the 2nd argument. 
export async function DELETE(req:Request,{params}:{params:{storeId:string,billboardId:string}}) {
    try{
        const {userId}=auth()
        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        
        if(!params.billboardId){
            return new NextResponse("Billboard ID is reuired",{status:400})
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
        //user is logged in but does not have permission to update other's billboard
            if(!storeByUserId){
                return new NextResponse("Unauthorized", {status:403})
            }

        const billboard=await prismadb.billboard.delete({
            where:{
                id:params.billboardId,
            
            },
            
        })
        return NextResponse.json(billboard)
    }
    catch(error){
        console.log("[BILLBOARD_DELETE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}


export async function GET(req:Request,{params}:{params:{billboardId:string}}) {
    try{
        
        if(!params.billboardId){
            return new NextResponse("Billboard ID is reuired",{status:400})
        }
        const billboard=await prismadb.billboard.findUnique({
            where:{
                id:params.billboardId,
            
            },
            
        })
        return NextResponse.json(billboard)
    }
    catch(error){
        console.log("[BILLBOARD_GET]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}