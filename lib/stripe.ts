import Stripe from "stripe";
//give stripe api key
export const stripe=new Stripe(process.env.STRIPE_API_KEY!,{
    apiVersion:"2023-10-16",
    typescript:true,
    
})