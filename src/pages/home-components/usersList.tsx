import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/chatServices";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import { User } from "../../types/type";
import { UsersListProps } from "../../types/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

function UsersList({
  loggedUser,
  setTargetUser,
  setShowConversation,
  onlineUsers,
}: UsersListProps) {
  const [users_search, setUsersSearch] = useState("");
  const debouncedSearch = useDebounce(users_search, 2000);

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => fetchUsers(debouncedSearch),
    staleTime: 0,
  });

  // console.log("Online users in render:", onlineUsers);
  // console.log("Users", users);

  // Loading / Error states
  if (isLoading)
    return (
      <div className="loading-wrapper">
        <Helix size="100" speed="2" color="#6941c6" />
      </div>
    );
  if (error) return <p>{(error as Error).message}</p>;
  if (!users) return <p>No users found.</p>;

  return (
    <div className="users">
      <div className="heading-wrapper">
        <h2>Chat</h2>
      </div>

      <div className="profile-wrapper">
        <div className="img-wrapper">
          <img
            src={
              loggedUser?.image_path === "images/default.png"
                ? `${API_URL}/${loggedUser.image_path}`
                : `${API_URL}/storage/${loggedUser?.image_path}`
            }
            alt="Profilna slika"
          />
        </div>
        <div className="name">{loggedUser?.name}</div>
        <div className="status">Available</div>
      </div>

      <div className="search-wrapper">
        <input
          style={{ width: "100%" }}
          onChange={(e) => setUsersSearch(e.target.value)}
          value={users_search}
          className="header-search"
          placeholder="Search users..."
          type="search"
        />
      </div>

      <div className="chats">
        {users.data.map((user: User) => {
          // Check online
          const isOnline = onlineUsers.some(
            (u) => Number(u.id) === Number(user.id)
          );

          return (
            <div
              onClick={() => {
                setTargetUser(user);
                setShowConversation(true);
              }}
              key={user.id}
              className="chat"
            >
              <div className="user-img-wrapper">
                <img
                  src={
                    user?.image_path === "images/default.png"
                      ? `${API_URL}/${user.image_path}`
                      : `${API_URL}/storage/${user.image_path}`
                  }
                  alt="Profilna slika"
                />
                {/* IS online */}
                <div
                  className={`contact-status ${
                    isOnline ? "online" : "offline"
                  }`}
                ></div>
              </div>
              <div className="text-wrapper">
                <div className="chat-name">{user.username}</div>

                <div className="chat-text">
                  {user?.last_message || "No messages yet"}
                </div>
              </div>
              <div className="chat-time">
                {user
                  ? new Date(user.last_message_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersList;
