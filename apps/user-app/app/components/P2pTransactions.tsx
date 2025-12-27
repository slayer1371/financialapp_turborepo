import { Card } from "@repo/ui/card"

export const P2pTransactions = ({
    transactions
}: {
    transactions: {
        id: number,
        amount: number,
        timestamp: Date,
        type: "sent" | "received",
        otherUserName?: string,
        otherUserNumber: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="P2P Transactions">
            <div className="text-center pb-8 pt-8">
                No transactions yet
            </div>
        </Card>
    }

    return <Card title="P2P Transactions">
        <div className="pt-2">
            {transactions.map(t => (
                <div key={t.id} className="flex justify-between border-b border-slate-200 py-2">
                    <div>
                        <div className="text-sm font-medium">
                            {t.type === "sent" ? "Sent to" : "Received from"}
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.otherUserName || t.otherUserNumber}
                        </div>
                        <div className="text-slate-500 text-xs">
                            {t.timestamp.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className={t.type === "sent" ? "text-red-600" : "text-green-600"}>
                            {t.type === "sent" ? "-" : "+"} Rs {t.amount / 100}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </Card>
}
