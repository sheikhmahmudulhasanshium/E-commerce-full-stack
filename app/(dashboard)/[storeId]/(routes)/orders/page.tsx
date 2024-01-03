import prismadb from "@/lib/prismadb";
import {  OrderClient } from "./components/client";
import { format } from "date-fns";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage =async ({params}:{params:{storeId:string}}) => {
    const orders=await prismadb.order.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedOrders:OrderColumn[]=orders.map((item)=>({
        id:item.id,
        phone:item.phone,
        address:item.address,
        //created an array and join that array and seperate each product with ', '
        products:item.orderItems.map((orderItem)=>orderItem.product.name).join(', '),
        //default value=0
        totalPrice:formatter.format(item.orderItems.reduce((total,item)=>{
            return total + Number(item.product.price)
        },0)),
        isPaid:item.isPaid,
        createdAt:format(item.createdAt,"MMMM do,yyyy"),
    }))
    return ( 
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
            {/* this is a client component that will load all the order*/}
                <OrderClient data={formattedOrders}/>
            </div>
        </div>
     );
}
 
export default OrdersPage;