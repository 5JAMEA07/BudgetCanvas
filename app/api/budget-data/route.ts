import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const budgetDataSnapshot = await getDocs(collection(db, "budgetData"));
    const budgetData = budgetDataSnapshot.docs
      .filter((doc) => doc.data().userId === userId)
      .map((doc) => doc.data());

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const totalBudgetAmount = userData?.totalBudgetAmount || 0;

    return NextResponse.json({ budgetData, totalBudgetAmount });
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { budgetCategory, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const budgetDataSnapshot = await getDocs(collection(db, "budgetData"));
    const existingCategories = budgetDataSnapshot.docs
      .filter((doc) => doc.data().userId === userId)
      .map((doc) => doc.data().name);

    if (existingCategories.includes(budgetCategory.name)) {
      return NextResponse.json(
        { error: "Budget category already exists" },
        { status: 400 }
      );
    }

    const budgetDocRef = doc(collection(db, "budgetData"), budgetCategory.id);
    await setDoc(budgetDocRef, {
      ...budgetCategory,
      userId,
    });

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const totalBudgetAmount =
      (userData?.totalBudgetAmount || 0) + budgetCategory.amount;
    await setDoc(userDocRef, { totalBudgetAmount }, { merge: true });

    return NextResponse.json({
      message: "Budget category created successfully",
    });
  } catch (error) {
    console.error("Error creating budget category:", error);
    return NextResponse.json(
      { error: "Failed to create budget category" },
      { status: 500 }
    );
  }
}
