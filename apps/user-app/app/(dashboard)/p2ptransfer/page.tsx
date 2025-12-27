
import SendMoney from "../../components/SendMoneyp2p";
import { P2pTransactions } from "../../components/P2pTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "@repo/db";

async function getP2pTransactions() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return [];
    }

    const userId = Number(session.user.id);

    const transactions = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: true,
            toUser: true
        },
        orderBy: {
            timestamp: "desc"
        }
    });

    return transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        timestamp: t.timestamp,
        type: t.fromUserId === userId ? ("sent" as const) : ("received" as const),
        otherUserName: t.fromUserId === userId ? t.toUser.name : t.fromUser.name,
        otherUserNumber: t.fromUserId === userId ? t.toUser.number : t.fromUser.number
    }));
}

export default async function P2PTransfer() {
    const transactions = await getP2pTransactions();

    return (
        <div className="w-full">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                P2P Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <SendMoney />
                </div>
                <div>
                    <P2pTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    );
}