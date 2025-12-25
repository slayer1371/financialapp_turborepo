"use client";

import { useBalance } from "@repo/store";

export default function Testpage() {
    const balance = useBalance((state) => state.balance);
    return (
        <div>
            Balance: {balance}
        </div>
    )
}