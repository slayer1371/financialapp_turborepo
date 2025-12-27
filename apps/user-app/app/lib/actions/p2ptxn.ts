"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { prisma } from "@repo/db";

export default async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        throw new Error("Not authenticated");
    }

    const touser = await prisma.user.findFirst({
        where : {
            number : to
        }
    })

    if(!touser) {
        throw new Error("Recipient not found");
    }

    await prisma.$transaction(async(tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        //this locks the row for the sender, and another request coming in to send money from the same user 
        // will wait till this transaction is done

        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(from)
            }
        })

        if(!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient balance");
        }

        await tx.balance.update({
            where : {
                userId : Number(from)
            },
            data : {
                amount : {
                    decrement : amount
                }
            }
        })

        await tx.balance.update({
            where : {
                userId : touser.id
            },
            data: {
                amount : {
                    increment : amount
                }
            }
        })

        await tx.p2pTransfer.create({
            data : {
                amount : amount,
                timestamp : new Date(),
                fromUserId : Number(from),
                toUserId : touser.id
            }
        })
    })
    }