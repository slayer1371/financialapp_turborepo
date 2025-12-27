import express from "express";
import { prisma } from "@repo/db";

const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
        //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

        /*
        const pi = {
        token : req.body.token}

        */
    
    const paymentInformation : {token : string, userId: string, amount: string} = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    const status  = await prisma.onRampTransaction.findFirst({
        where : {
            token : paymentInformation.token
        }
    })

    if(!status) {
        return res.status(400).json({
            message : "Invalid token"
        })
    }

    if(status.status === "Success") {
        return  res.json({
            message : "Already processed"
        })
    }
    
    try {
        await prisma.$transaction([
            prisma.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            prisma.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    }catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})
    // Update balance in db, add txn record
    app.listen(3003);