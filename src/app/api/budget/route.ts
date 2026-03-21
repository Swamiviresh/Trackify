import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    await dbConnect();

    const user = await User.findById(userId).select("budget");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpenses = expenses.length > 0 ? expenses[0].total : 0;
    const budget = user.budget || 0;
    const remaining = budget - totalExpenses;
    const percentUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;
    const isOverBudget = budget > 0 && totalExpenses > budget;

    return NextResponse.json({
      budget,
      totalExpenses,
      remaining,
      percentUsed: Math.round(percentUsed * 100) / 100,
      isOverBudget,
    });
  } catch (error: unknown) {
    console.error("Get budget error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { budget } = await request.json();

    if (budget === undefined || budget < 0) {
      return NextResponse.json(
        { error: "Please provide a valid budget amount" },
        { status: 400 }
      );
    }

    await dbConnect();

    await User.findByIdAndUpdate(userId, { budget });

    return NextResponse.json({ message: "Budget updated", budget });
  } catch (error: unknown) {
    console.error("Update budget error:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}
