import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as { id?: string }).id ?? null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { amount, category, type, date, description } = await request.json();

    await dbConnect();

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Transaction updated",
      transaction: updated,
    });
  } catch (error: unknown) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    await Transaction.findByIdAndDelete(id);

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error: unknown) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
