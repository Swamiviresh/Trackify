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

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: Record<string, unknown> = { userId };

    if (type && type !== "all") {
      query.type = type;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        (query.date as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.date as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    return NextResponse.json({ transactions });
  } catch (error: unknown) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
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

    const { amount, category, type, date, description } = await request.json();

    if (!amount || !category || !type || !date) {
      return NextResponse.json(
        { error: "Amount, category, type, and date are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be income or expense" },
        { status: 400 }
      );
    }

    await dbConnect();

    const transaction = await Transaction.create({
      userId,
      amount,
      category,
      type,
      date: new Date(date),
      description: description || "",
    });

    return NextResponse.json(
      { message: "Transaction created", transaction },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
