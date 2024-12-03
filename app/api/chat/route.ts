import { console } from "inspector";
import { tursoClient } from "../../db/turso";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    const url = new URL(req.url);
    const userID = url.searchParams.get('userID');  // Extract userID from the URL

    if (userID){

        try {


            const resultSet = await tursoClient.execute({
                sql: `SELECT DISTINCT c.ID_chat, 
                    CASE 
                        WHEN c.ID_usuario1 = ? THEN c.ID_usuario2 
                        ELSE c.ID_usuario1 
                        END AS userID
                        FROM chats c
                        WHERE c.ID_usuario1 = ? OR c.ID_usuario2 = ?;`,
                args: [userID, userID, userID]
            });

            const chats = resultSet.rows; 

            if (chats.length === 0) {
                return NextResponse.json({ chats: [] });
            }

            const chatsWithMessages = await Promise.all(chats.map(async (chat) => {
                const messagesResultSet = await tursoClient.execute({
                    sql: `SELECT m.ID_mensaje, m.texto AS content, m.de AS fromSelf, m.created_at
                        FROM mensajes m
                        WHERE m.ID_chat = ?
                        ORDER BY m.created_at ASC;`,
                    args: [chat.ID_chat]
                });

                const messages = messagesResultSet.rows;

                return {
                    ...chat,
                    messages,
                };
            }));

            return NextResponse.json({ chats: chatsWithMessages });
        } catch (error) {
            console.error("Error fetching chats:", error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
    else{
        try {
            const users_db = await tursoClient.execute(
                `SELECT ID_usuario, Nombre, Correo FROM Usuario;`
            );
            return NextResponse.json({ users_db });
        } catch (error) {
            console.error("Error fetching users:", error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }

}

export async function POST(req: Request) {
    try {

        const body = await req.json();
        const { messagesToSave } = body;

        if (!messagesToSave || messagesToSave.length === 0) {
            return NextResponse.json({ message: 'No messages to save' }, { status: 200 });
        }
  
        const transaction = await tursoClient.transaction();
  
        // Loop through each message to save
        for (const message of messagesToSave) {
            const { user1, user2, content, from } = message;
  
            // Ensure user1 < user2 to maintain a consistent order
            const [userA, userB] = user1 < user2 ? [user1, user2] : [user2, user1];
  
            const chatResult = await transaction.execute(`
                SELECT ID_chat
                FROM  chats
                WHERE ID_usuario1 = ${userA} AND ID_usuario2 = ${userB};
            `);

            const chatID = chatResult.rows[0].ID_chat
  
            console.log(chatResult.rows[0].ID_chat);
            
            if (chatID) {
                const result = await transaction.execute(`
                    INSERT INTO mensajes (ID_chat, de, texto) 
                    VALUES (${chatID}, ${from}, '${content}');
                `);
            }
            
            
        }

        await transaction.commit();
  

        console.log('Messages saved successfully');
        return NextResponse.json({ message: 'Messages saved successfully' });
    } catch (error) {

        console.error(error);
        return NextResponse.json({ message: 'Error saving messages3' }, { status: 500 });
    }
}