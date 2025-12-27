"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";
import p2pTransfer from "../lib/actions/p2ptxn";

export default function SendMoney() {
    const [number, setNumber] = useState("");
    const [value, setValue] = useState(0);
    const [note, setNote] = useState("");
    return (
        <Card title="Send Money (P2P)">
            <form className="flex flex-col gap-3 pt-3" >

                <TextInput label="Number" placeholder="Enter number" onChange={(val) => {
                    setNumber(val)
                }} />

                <TextInput label="Amount(INR)" placeholder="Enter amount" onChange={(val) => {setValue(Number(val))}} />

                <TextInput label="Note (optional)" placeholder="Add a note for the recipient" onChange={(val) => {
                    setNote(val)
                }} />

                <div className="flex justify-end">
                <Button onClick={async () => {
                    await p2pTransfer(number, value * 100)
                }}>
                Send Money
                </Button>
                </div>
            </form>
        </Card>
    );
}