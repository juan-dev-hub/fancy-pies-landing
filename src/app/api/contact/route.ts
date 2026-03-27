import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactNotification, sendConfirmationEmail } from "@/lib/email";

// GET - Retrieve all contact messages (for admin)
export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener los mensajes" },
      { status: 500 }
    );
  }
}

// POST - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { success: false, error: "El mensaje debe tener al menos 10 caracteres" },
        { status: 400 }
      );
    }

    // Save to database
    const contactMessage = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });

    // Log for debugging
    console.log("✅ New contact message saved:", {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      timestamp: contactMessage.createdAt,
    });

    // Send emails in background (don't block the response)
    // Send notification to store owner
    sendContactNotification({
      name: contactMessage.name,
      email: contactMessage.email,
      message: contactMessage.message,
    }).then((result) => {
      if (result.success) {
        console.log("📧 Notification email sent:", result.id);
      } else {
        console.error("📧 Failed to send notification:", result.error);
      }
    }).catch((err) => {
      console.error("📧 Email error:", err);
    });

    // Send confirmation to user
    sendConfirmationEmail({
      name: contactMessage.name,
      email: contactMessage.email,
      message: contactMessage.message,
    }).then((result) => {
      if (result.success) {
        console.log("📧 Confirmation email sent:", result.id);
      } else {
        console.error("📧 Failed to send confirmation:", result.error);
      }
    }).catch((err) => {
      console.error("📧 Email error:", err);
    });

    return NextResponse.json({
      success: true,
      message: "¡Mensaje enviado correctamente! Te contactaremos pronto.",
      data: {
        id: contactMessage.id,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { success: false, error: "Error al enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact message (for admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID del mensaje requerido" },
        { status: 400 }
      );
    }

    await db.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Mensaje eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar el mensaje" },
      { status: 500 }
    );
  }
}

// PATCH - Mark message as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID del mensaje requerido" },
        { status: 400 }
      );
    }

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({
      success: true,
      message: "Estado actualizado",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el mensaje" },
      { status: 500 }
    );
  }
}
