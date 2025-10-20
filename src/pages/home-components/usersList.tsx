/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  editOtherUser,
  fetchUsers,
} from "../../services/chatServices";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebaunce";
import { Helix } from "ldrs/react";
import { EditUserForm, User } from "../../types/type";
import { UsersListProps } from "../../types/interfaces";
import { showErrorToast, showSuccessToast } from "../../components/toast";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

function UsersList({
  loggedUser,
  setTargetUser,
  setShowConversation,
  onlineUsers,
}: UsersListProps) {
  const [users_search, setUsersSearch] = useState("");
  const debouncedSearch = useDebounce(users_search, 2000);

  const queryClient = useQueryClient();
  const [openDropdownUserId, setOpenDropdownUserId] = useState<number | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset } = useForm<EditUserForm>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownUserId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => fetchUsers(debouncedSearch),
    staleTime: 0,
    refetchInterval: 3000, // automatski refresh
    placeholderData: (prev) => prev,
  });

  // console.log("Online users in render:", onlineUsers);
  // console.log("Users", users);

  // React Form Hook

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("User deleted successfully!");
    },
    onError: () => {
      showErrorToast("Failed to delete user!");
    },
  });

  //// Patch HTTP method Edit user, not finished yet
  const { mutate: editOtherUserMutation } = useMutation({
    mutationFn: ({ username, userId }: { username: string; userId: number }) =>
      editOtherUser(username, userId),

    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("User is updated!");
    },

    onError: () => {
      showErrorToast("Failed to update user");
    },
  });

  // Edit other user info
  function onSubmit(data: EditUserForm, userId: number) {
    editOtherUserMutation({ username: data.username, userId });
    setOpenDropdownUserId(null);
  }

  // Delete user
  function handleDelete(userId: number) {
    deleteUserMutation.mutate(Number(userId));
  }

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

          // console.log("USER", user);
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
                <div className="chat-name mb-8">{user.username}</div>

                <div className="chat-text">
                  {user?.last_message || "No messages yet"}
                </div>
              </div>
              <div className="chat-time">
                {/* Options */}

                {(loggedUser?.email === "jovanvuks1995@gmail.com" ||
                  loggedUser?.email === "bbogdanovic167@gmail.com") &&
                user?.is_admin === 0 ? (
                  <>
                    <div className="options">
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetUser(null);
                          handleDelete(user.id);
                        }}
                        className="mr-8"
                        src="/icons/delete-user.png"
                        alt="delete icon"
                      />
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownUserId((prev) => {
                            const newId = prev === user.id ? null : user.id;
                            if (newId === user.id) {
                              reset({ username: user.username }); // resetuje formu sa trenutnim username
                            }
                            return newId;
                          });
                        }}
                        src="/icons/dots-menu.png"
                        alt="icon"
                      />
                    </div>
                    {/* User options dropdown */}
                    {openDropdownUserId === user.id && (
                      <div className="dropdown" ref={dropdownRef}>
                        <form
                          onClick={(e) => e.stopPropagation()}
                          onSubmit={handleSubmit((data) =>
                            onSubmit(data, user.id)
                          )}
                        >
                          <input
                            type="text"
                            placeholder="New nickname..."
                            style={{ width: "100%", marginBottom: "5px" }}
                            defaultValue={user?.username || ""}
                            {...register("username", {
                              required: "Username is required",
                            })}
                          />
                          <button type="submit" className="btn">
                            Save
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}

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
