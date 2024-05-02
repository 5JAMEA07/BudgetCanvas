// api/firebase-actions/routes.ts

import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const accessToken = userData.accessToken;
      const itemId = userData.itemId;
      const isBankConnected = userData.isBankConnected || false;

      return NextResponse.json({ accessToken, itemId, isBankConnected });
    } else {
      return NextResponse.json({
        accessToken: null,
        itemId: null,
        isBankConnected: false,
      });
    }
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Firestore" },
      { status: 500 }
    );
  }
}
