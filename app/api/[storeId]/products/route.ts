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
        const {name,price, categoryId,colorId,sizeId,images,isFeatured,isArchived}=body

        if(!userId){
            return new NextResponse("Unauthenticated", {status:403})
        }
        if(!name){
            return new NextResponse("Name is required",{status:400})
        }
        if(!images||!images.length){
            return new NextResponse("Images are required",{status:400})
        }
        if(!price){
            return new NextResponse("Price is required",{status:400})
        }
        if(!categoryId){
            return new NextResponse("Category ID is required",{status:400})
        }
        if(!sizeId){
            return new NextResponse("Size ID is required",{status:400})
        }
        if(!colorId){
            return new NextResponse("Color ID is required",{status:400})
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
        //user is logged in but does not have permission to update other's product
        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status:405})
        }
        //if everything is available create billbooard
        const product=await prismadb.product.create({
            data:{
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId:params.storeId,
                //images are seperate model
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }
    catch(error){
       console.log("[PRODUCTS_POST]",error) 
       return new NextResponse("Internal error",{status:500})
    }
}


export async function GET(req:Request,{params}:{params:{storeId:string}}) {
    try{
        const {searchParams}=new URL(req.url)
        const categoryId=searchParams.get("categoryId")||undefined
        const colorId=searchParams.get("colorId")||undefined        
        const sizeId=searchParams.get("sizeId")||undefined
        const isFeatured=searchParams.get("isFeatured")



        
        if(!params.storeId){
            return new NextResponse("Store ID is required",{status:400})
        }

       
        
        const products=await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colorId,
                sizeId,
                //if the product is not featured it will be ignored
                isFeatured:isFeatured?true:undefined,
                isArchived:false
            },
            //to show relation in the front-end
            include:{
                images:true,
                category:true,
                color:true,
                size:true,
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return NextResponse.json(products)
    }
    catch(error){
       console.log("[PRODUCTS_GET]",error) 
       return new NextResponse("Internal error",{status:500})
    }
}