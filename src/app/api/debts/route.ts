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

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = { userId };

    if (type && type !== "all") {
      query.type = type;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const debts = await Debt.find(query).sort({ date: -1 });

    return NextResponse.json({ debts });
  } catch (error: unknown) {
    console.error("Get debts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendName, amount, type, date, notes } = await request.json();

    if (!friendName || !amount || !type || !date) {
      return NextResponse.json(
        { error: "Friend name, amount, type, and date are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (!["lent", "borrowed"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be lent or borrowed" },
        { status: 400 }
      );
    }

    await dbConnect();

    const debt = await Debt.create({
      userId,
      friendName,
      amount,
      type,
      date: new Date(date),
      notes: notes || "",
    });

    return NextResponse.json(
      { message: "Debt record created", debt },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create debt error:", error);
    return NextResponse.json(
      { error: "Failed to create debt record" },
      { status: 500 }
    );
  }
}
