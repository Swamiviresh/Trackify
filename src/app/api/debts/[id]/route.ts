import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Debt from "@/models/Debt";

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
    const body = await request.json();

    await dbConnect();

    const debt = await Debt.findOne({ _id: id, userId });
    if (!debt) {
      return NextResponse.json(
        { error: "Debt record not found" },
        { status: 404 }
      );
    }

    const updated = await Debt.findByIdAndUpdate(
      id,
      {
        ...(body.friendName !== undefined && { friendName: body.friendName }),
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Debt record updated",
      debt: updated,
    });
  } catch (error: unknown) {
    console.error("Update debt error:", error);
    return NextResponse.json(
      { error: "Failed to update debt record" },
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

    const debt = await Debt.findOne({ _id: id, userId });
    if (!debt) {
      return NextResponse.json(
        { error: "Debt record not found" },
        { status: 404 }
      );
    }

    await Debt.findByIdAndDelete(id);

    return NextResponse.json({ message: "Debt record deleted" });
  } catch (error: unknown) {
    console.error("Delete debt error:", error);
    return NextResponse.json(
      { error: "Failed to delete debt record" },
      { status: 500 }
    );
  }
}
