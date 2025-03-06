import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, PenLine } from "lucide-react";
import { useModal } from "../contexts/modal-context";
import { AnimatedNavLink } from "./ui/animated-anchor";
import { User } from "../interface/User";
import { authUtils } from "../utils/authUtils";
import { getSenderInbox, getReceiverInbox, markInboxAsRead, updateInboxStatus } from "../controller/inboxController";
import { Inbox } from "../../../declarations/inbox/inbox.did";
import { getUserById } from "../controller/userController";

const Navbar = () => {
  const { setOpen } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const nav = useNavigate();

  const { cookie, session, current_user } = authUtils();

  const profpicClick = useCallback(() => {
    nav("/profile");
  }, [nav]);

  const logoClick = useCallback(() => {
    nav("/");
  }, [nav]);

  useEffect(() => {
    if (current_user && cookie && session) {
      const user = JSON.parse(current_user).ok;
      const profile = user.profilePicture;
      if (profile) {
        const u8 = new Uint8Array(Object.values(profile));
        const blob = new Blob([u8], { type: "image/png" });
        user.profilePicture = blob;
      }
      setUser(user);
    } else {
      setUser(null);
    }
  }, [current_user]);

  const fetchInbox = useCallback(async () => {
    try {
      const [receiverRes, senderRes] = await Promise.all([
        getReceiverInbox(user?.id || ""),
        getSenderInbox(user?.id || "")
      ]);
      if (receiverRes) setReceiverInbox(receiverRes);
      if (senderRes) setSenderInbox(senderRes);
    } catch (error) {
      console.error("Failed to fetch inbox:", error);
    }
  }, [user?.id]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [receiverInbox, setReceiverInbox] = useState<Inbox[]>([]);
  const [senderInbox, setSenderInbox] = useState<Inbox[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user?.id) {
      fetchInbox();
    }
  }, [user?.id, fetchInbox]);

  const getUsernameById = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const result = await getUserById(userId);
      if (result) {
        return result.username;
      }
      return null;
    } catch (error) {
      console.error("Failed to get user by id:", error);
      return null;
    }
  }, []);

  const fetchUsernames = useCallback(async () => {
    const uniqueUserIds = [
      ...new Set([
        ...receiverInbox.map(n => n.senderId),
        ...senderInbox.map(n => n.receiverId)
      ])
    ];

    // Filter out already fetched usernames
    const newUserIds = uniqueUserIds.filter(id => !usernames[id]);

    if (newUserIds.length > 0) {
      const usernameMap: { [key: string]: string } = {};
      const usernamePromises = newUserIds.map(async (id) => {
        const username = await getUsernameById(id);
        if (username) {
          usernameMap[id] = username;
        }
      });

      await Promise.all(usernamePromises); // Wait for all requests to complete
      setUsernames((prev) => ({ ...prev, ...usernameMap })); // Merge with existing usernames
    }
  }, [receiverInbox, senderInbox, usernames, getUsernameById]);

  useEffect(() => {
    if (receiverInbox.length > 0 || senderInbox.length > 0) {
      fetchUsernames();
    }
  }, [receiverInbox, senderInbox, fetchUsernames]);

  const markAsRead = useCallback(async (inboxId: string) => {
    try {
      await markInboxAsRead(inboxId);
      setReceiverInbox((prev) =>
        prev.map((n) => (n.id === inboxId ? { ...n, read: true } : n))
      );
      setSenderInbox((prev) =>
        prev.map((n) => (n.id === inboxId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const handleStatusUpdate = useCallback(async (inboxId: string, status: "Accepted" | "Rejected") => {
    try {
      await updateInboxStatus(inboxId, status);
      fetchInbox(); // Refresh inbox data
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }, [fetchInbox]);

  const toggleNotifications = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const unreadCount = useMemo(
    () => [
      ...receiverInbox.filter((n) => !n.read),
      ...senderInbox.filter((n) => !n.read)
    ].length,
    [receiverInbox, senderInbox]
  );

  const notificationBell = (
    <div className="relative mr-4" ref={notificationRef}>
      <button
        onClick={toggleNotifications}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-xs text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          </div>
        )}
      </button>

      {isNotificationOpen && (
        <div className="absolute right-2 mt-3 w-100 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-2 border-b">
            <button
              onClick={async () => {
                await Promise.all([
                  ...receiverInbox.filter((n) => !n.read).map((n) => markAsRead(n.id)),
                  ...senderInbox.filter((n) => !n.read).map((n) => markAsRead(n.id))
                ]);
              }}
              className="w-full text-sm text-blue-500 hover:text-blue-700 text-left px-2 py-1 cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {/* Receiver Inbox */}
            {receiverInbox.length > 0 && (
              <div className="p-2 bg-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Received Requests</h3>
              </div>
            )}
            {receiverInbox.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-bg
                   ${
                  notification.read && notification.status === 'Rejected'
                    ? 'bg-red-100'
                    : notification.status === 'Accepted'
                        ? 'bg-green-100'
                        : notification.status === 'Rejected'
                            ? 'bg-red-200'
                            : 'bg-white'
                }`}
              >
                <div className="font-medium text-sm">
                  {notification.submission_type}
                </div>
                <div className="text-sm text-gray-600">
                  From: {usernames[notification.senderId] || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">
                  {/* {new Date(notification.createdAt).toLocaleString()} */}
                </div>
                {notification.status === 'Pending' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleStatusUpdate(notification.id, 'Accepted')}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(notification.id, 'Rejected')}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
                <div className={`text-xs mt-1 ${
                  notification.status === 'Accepted'
                      ? 'text-green-600'
                      : notification.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-gray-500'
                }`}>
                  Status: {notification.status}
                </div>
              </div>
            ))}

            {/* Sender Inbox */}
            {senderInbox.length > 0 && (
              <div className="p-2 bg-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Sent Requests</h3>
              </div>
            )}
            {senderInbox.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-bg
                   ${
                  notification.status === 'Accepted'
                      ? 'bg-green-100'
                      : notification.status === 'Rejected'
                          ? 'bg-red-100'
                          : 'bg-white'
                }`}
              >
                <div className="font-medium text-sm">
                  {notification.submission_type}
                </div>
                <div className="text-sm text-gray-600">
                  To: {usernames[notification.receiverId] || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">
                  {/* {new Date(notification.createdAt).toLocaleString()} */}
                </div>
                <div className={`text-xs mt-1 ${
                  notification.status === 'Accepted'
                      ? 'text-green-600'
                      : notification.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-gray-500'
                }`}>
                  Status: {notification.status}
                </div>
              </div>
            ))}

            {receiverInbox.length === 0 && senderInbox.length === 0 && (
              <div className="p-4 text-gray-500 text-sm">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 shadow-md flex-none bg-[#F9F7F7] text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div
              onClick={logoClick}
              className="text-4xl font-thin tracking-tighter hover:cursor-pointer"
            >
              <span className="text-[#3F72AF]">E</span>RGASIA.
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex justify-around items-center">
              <AnimatedNavLink href="/find">Find Work</AnimatedNavLink>
              <AnimatedNavLink href="/manage">Manage Jobs</AnimatedNavLink>
              <AnimatedNavLink href="/post">Post a Job</AnimatedNavLink>
              <AnimatedNavLink href="/browse">Browse Freelancers</AnimatedNavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex gap-3 items-center hover:cursor-pointer">
                {notificationBell}
                <a onClick={profpicClick}>{user.username}</a>
                <img
                  onClick={profpicClick}
                  src={
                    user.profilePicture
                      ? URL.createObjectURL(user.profilePicture)
                      : "/default-avatar.png"
                  }
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setOpen(true)}
                  className="w-full bg-transparent hover:bg-opacity-90 hover:border-2 px-4 py-2 rounded-2xl text-sm font-medium border-solid border border-black"
                >
                  <div className="flex items-center justify-center text-center">
                    Sign in <PenLine className="inline stroke-2 w-4" />
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;