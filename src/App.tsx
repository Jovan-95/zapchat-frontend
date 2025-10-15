import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/privateRoute";
import PublicRoute from "./components/publicRoute";
import Layout from "./components/layout";
import "ldrs/ring";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { ToastContainer } from "react-toastify";
import { Members, OnlineUser } from "./types/interfaces";
import { getPusher, initPusher } from "./pusherClient";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ChatMessage, LiveMessage, User } from "./types/type";
import { transformLiveToChat } from "./utils/utils";

const Register = lazy(() => import("./pages/auth-pages/register"));
const Login = lazy(() => import("./pages/auth-pages/login"));
const ForgotPassword = lazy(() => import("./pages/auth-pages/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth-pages/reset-password"));

const Home = lazy(() => import("./pages/home"));
const Settings = lazy(() => import("./pages/settings"));

// Default values shown

function App() {
    const loggedUser = useSelector(
        (state: RootState) => state.auth.loggedInUser
    );
    // Online users
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    // Conversation messages
    const [conversationMessages, setConversationMessages] = useState<
        ChatMessage[]
    >([]);
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

    // Audio
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const soundEnabledRef = useRef(false);

    // Sound msg
    useEffect(() => {
        // kreiraj audio jednom
        audioRef.current = new Audio("/sounds/msg-sound.mp3");

        const enableSound = () => {
            const audio = audioRef.current;
            if (!audio) return;

            // pokušaj da "otključaš" audio bez stvarnog zvuka
            audio.muted = true;
            audio
                .play()
                .then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.muted = false;
                    soundEnabledRef.current = true;
                    console.log("🔊 Sound unlocked and ready!");
                })
                .catch((err) => {
                    console.warn("⚠️ Sound unlock failed:", err);
                });

            window.removeEventListener("click", enableSound);
        };

        window.addEventListener("click", enableSound);
        return () => window.removeEventListener("click", enableSound);
    }, []);

    // Sound function
    const playNotification = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) {
            console.warn("Audio not initialized yet");
            return;
        }
        if (!soundEnabledRef.current) {
            console.warn("🔕 User hasn't interacted yet, sound blocked");
            return;
        }

        audio.currentTime = 0;
        audio.play().catch((err) => {
            console.warn("❌ Failed to play notification:", err);
        });
    }, []);

    //// !!!! Online user presence Pusher live
    useEffect(() => {
        if (!loggedUser?.auth_token) return;

        // Pusher initialized after login!
        const pusher = initPusher(loggedUser.auth_token);
        const presenceChannel = pusher.subscribe("presence-online");

        presenceChannel.bind(
            "pusher:subscription_succeeded",
            (members: Members) => {
                const users = Object.values(members.members) as OnlineUser[];
                setOnlineUsers(users);
            }
        );

        presenceChannel.bind("pusher:member_added", (member: OnlineUser) => {
            setOnlineUsers((prev) => {
                const exists = prev.some(
                    (u) => Number(u.id) === Number(member.id)
                );
                if (!exists) return [...prev, member];
                return prev;
            });
        });

        presenceChannel.bind("pusher:member_removed", (member: OnlineUser) => {
            setOnlineUsers((prev) =>
                prev.filter((u) => Number(u.id) !== Number(member.id))
            );
        });

        return () => {
            presenceChannel.unbind_all();
            pusher.unsubscribe("presence-online");
        };
    }, [loggedUser]);

    //// !!!! Pusher subscription for live messages
    useEffect(() => {
        if (!loggedUser) return;

        const pusher = getPusher();
        if (!pusher) {
            console.warn("❌ Pusher not initialized");
            return;
        }

        const channelName = `private-chat.${loggedUser.id}`;
        const channel = pusher.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
            console.log(`✅ Subscription succeeded for ${channelName}`);
        });

        channel.bind("MessageSentEvent", (data: LiveMessage) => {
            // If logged user sent msg, ignore because of optimistic msg
            if (data.from_id === loggedUser.id) return;

            if (targetUser && data.from_id !== targetUser.id) return;

            setConversationMessages((prev) => {
                // Check optimistic msg duplicates
                const tempExists = prev.some(
                    (m) =>
                        String(m.id).startsWith("temp") &&
                        m.message === data.message &&
                        m.from_id === data.from_id
                );

                if (tempExists) {
                    // update temp msg
                    return prev.map((m) =>
                        String(m.id).startsWith("temp") &&
                        m.message === data.message &&
                        m.from_id === data.from_id
                            ? { ...m, ...data, confirmed: true }
                            : m
                    );
                }

                // Sound msg
                playNotification(); // 🔔

                // Type merging
                const newMessage = transformLiveToChat(
                    data,
                    loggedUser,
                    targetUser
                );
                return [...prev, newMessage];
            });
        });

        // Typing event
        channel.bind("UserTyping", (data: { fromId: number }) => {
            const fromId = Number(data.fromId); // ✅ ispravno
            setTypingUsers((prev) => ({ ...prev, [fromId]: true }));

            setTimeout(() => {
                setTypingUsers((prev) => ({ ...prev, [fromId]: false }));
            }, 2500);
        });

        return () => {
            console.log(`🧹 Cleanup for ${channelName}`);
            channel.unbind_all();
            pusher.unsubscribe(channelName);
        };
    }, [loggedUser, targetUser]);

    return (
        <>
            <BrowserRouter>
                <Suspense
                    fallback={<Helix size="45" speed="2.5" color="black" />}
                >
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Routes>
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PublicRoute>
                                    <ForgotPassword />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={
                                <PublicRoute>
                                    <ResetPassword />
                                </PublicRoute>
                            }
                        />

                        <Route element={<Layout />}>
                            {" "}
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Home
                                            onlineUsers={onlineUsers}
                                            targetUser={targetUser}
                                            setTargetUser={setTargetUser}
                                            conversationMessages={
                                                conversationMessages
                                            }
                                            setConversationMessages={
                                                setConversationMessages
                                            }
                                            typingUsers={typingUsers}
                                        />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <PrivateRoute>
                                        <Settings />
                                    </PrivateRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
