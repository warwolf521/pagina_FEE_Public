"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface User {
    userID: string;
    username: string;
    self: boolean;
    messages?: { content: string; fromSelf: boolean; backed_up: boolean }[];
}

interface Socket_User{
    socketID: string;
    username: string;
    self: boolean;
}

interface Message {
    content: string;
    fromSelf: boolean;
}

interface UsersDB {
    userID: string;
    correo: string;
    nombre: string;

}

export default function Chat() {
    const { data: session, status } = useSession();
    const [message, setMessage] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [usersDB, setUsersDB] = useState<UsersDB[]>([]);
    const [socket_users, setSocket_Users] = useState<Socket_User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if (session?.user) {
            socket = io({
                autoConnect: true,
                auth: { username: session?.user.id },
            });

        
            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);

                fetchUserDB();
                fetchChatsUser(session.user.id);
            });

            
            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            
                saveMessages(session.user.id);
            });

            socket.on("user disconnected", ({ socketID }) => {
                console.log("Socket disconnected:", socketID);

                setSocket_Users((prev) =>
                    prev.filter((user) => user.socketID !== socketID)
                );
            });

            socket.on("users", (serverUsers: Socket_User[]) => {
                setSocket_Users(serverUsers); 
            });


            socket.on("user connected", (socket_user: Socket_User) => {
                setSocket_Users((prev) => [...prev, socket_user]);
            });

            socket.on("private message", ({ content, username, from }: { content: string; username: string ;from: string }) => {

                setUsers((prevUsers) =>
                    prevUsers.map((user) => {
                        if (user.userID === username) {
                            const newMessage = { content, fromSelf: false, backed_up: false };
                            return { ...user, messages: [...(user.messages || []), newMessage] };
                        }
                        return user;
                    })
                );
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [session]);

    useEffect(() => {
        if (usersDB.length > 0 && session?.user) {
            fetchChatsUser(session.user.id);
        }
    }, [usersDB, session]);

    const transformChatsToUsers = (chats: any[], currentUserID: string, existingUsers: User[]): User[] => {
        return chats.map(chat => {
            const username = usersDB.find((u) => u.userID == chat.userID.toString())?.nombre || "Unknown";
            return {
                userID: chat.userID.toString(),
                username,
                self: chat.userID.toString() === currentUserID,
                messages: chat.messages?.map((message: Message) => ({
                    content: message.content,
                    fromSelf: message.fromSelf === (chat.userID.toString() === currentUserID), //lo cambie para poder compilarlo, creo que se rompio en el proceso
                    backed_up: true,
                })) || []
            };
        });
    };


    const fetchChatsUser = async (userID: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat?userID=${userID}`);
            if (!response.ok) {
                throw new Error('OK');
            }
            const data = await response.json();
            
            const transformedUsers = transformChatsToUsers(data.chats, userID, users);
            setUsers(transformedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const parseUsersDB = (data: any): UsersDB[] => {
        const { rows } = data.users_db;
    
        return rows.map((row: any) => ({
            userID: row[0].toString(), 
            nombre: row[1], 
            correo: row[2], 
        }));
    };

    const fetchUserDB = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat`);
            if (!response.ok) {
                throw new Error('OK');
            }
            const data = await response.json();
            
            const UsersDB = parseUsersDB(data);
            setUsersDB(UsersDB);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const saveMessages = async (user_id?: string, Users?: any) => {

        const messagesToSave = users.flatMap(user =>
            user.messages?.filter(message => !message.backed_up)
                .map(message => {

                    message.backed_up = true;
        
                    return {
                        user1: user_id,
                        user2: user.userID,
                        content: message.content,
                        from: message.fromSelf ? user_id : user.userID,
                    };
                })
        );

        if (messagesToSave.length > 0){
        
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messagesToSave: messagesToSave })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        
    };

    const onMessage = (content: string) => {
        if (selectedUser) {
            
            const socketSelected = socket_users.find((u) => u.username === selectedUser.userID)?.socketID;

            console.log(socketSelected, users);

            if(socketSelected == undefined){
                saveMessages(selectedUser.userID, users);
            }
            else{
                socket.emit("private message", {
                    content,
                    to: socketSelected,
                });
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.userID === selectedUser.userID) {
                        return {
                            ...user,
                            messages: [...(user.messages || []), { content, fromSelf: true, backed_up: false }],
                        };
                    }
                    return user;
                })
            );
           
            setMessage('');
        }
    };
    
    useEffect(() => {
        if (selectedUser) {
            const updatedUser = users.find(user => user.userID === selectedUser.userID);
            setSelectedUser(updatedUser || selectedUser);
        }
    }, [users, selectedUser]);

    useEffect(() => {
        const interval = setInterval(() => {
          saveMessages(session?.user.id, users);
        }, 1000);
      
        return () => clearInterval(interval);
    }, [session, users]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && message.trim()) {
            onMessage(message);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h3>Contactos </h3>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.userID}
                            onClick={() => setSelectedUser(user)}
                            style={{
                                cursor: 'pointer',
                                fontWeight: user.self ? 'bold' : 'normal',
                                backgroundColor: selectedUser?.userID === user.userID ? '#e0e0e0' : 'transparent',
                                padding: '5px',
                            }}
                        >
                            {user.username} {user.self ? "(You)" : ""}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: 1, padding: '20px' }}>
                <h3>{selectedUser ? selectedUser.username : '...'}</h3>

                <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'auto' }}>
                    {selectedUser?.messages?.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign: msg.fromSelf ? 'right' : 'left',
                                margin: '5px 0',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    padding: '8px',
                                    borderRadius: '10px',
                                    backgroundColor: msg.fromSelf ? '#007bff' : '#e9e9eb',
                                    color: msg.fromSelf ? '#fff' : '#000',
                                }}
                            >
                                {msg.content}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Escriba un mensaje"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        style={{ flex: 1, padding: '8px', borderRadius: '5px' }}
                    />
                    <button className='btn btn-primary' onClick={() => onMessage(message)} style={{ marginLeft: '5px' }}>
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}