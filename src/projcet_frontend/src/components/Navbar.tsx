import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, PenLine } from "lucide-react";
import { useModal } from "../contexts/modal-context";
import { AnimatedNavLink } from "./ui/animated-anchor";
import { User } from "../interface/User";
import { authUtils } from "../utils/authUtils";
import { getAllInboxByUserId } from "../controller/inboxController";
import { Inbox } from "../../../declarations/inbox/inbox.did";
import { getUserById } from "../controller/userController";
import FloatingInbox from "./sections/Inbox";
import { InboxResponse } from "../interface/Inbox";

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
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxes, setInboxes] = useState<InboxResponse[]>([]);
  const fetchInbox = useCallback(async () => {
    try {
      const inboxResult = await getAllInboxByUserId(user?.id || "");
      if (inboxResult) {
        setInboxes(inboxResult);
      }
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

  const getUsernameById = useCallback(
    async (userId: string): Promise<string | null> => {
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
    },
    []
  );

  const fetchUsernames = useCallback(async () => {
    const uniqueUserIds = [
      ...new Set([
        ...receiverInbox.map((n) => n.senderId),
        ...senderInbox.map((n) => n.receiverId),
      ]),
    ];

    // Filter out already fetched usernames
    const newUserIds = uniqueUserIds.filter((id) => !usernames[id]);

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

  return (
    <nav className="sticky top-0 shadow-md flex-none bg-[#F9F7F7] text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-12">
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
              <AnimatedNavLink href="/browse">
                Browse Freelancers
              </AnimatedNavLink>
              {user ? (
                <div className="ml-6 flex gap-6 items-center">
                  <FloatingInbox
                    isOpen={inboxOpen}
                    messages={inboxes}
                    onClose={() => setInboxOpen(false)}
                  />
                  <motion.div
                    className="flex flex-row items-center gap-4 hover:cursor-pointer hover:bg-gray-200 px-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.div>
                  <button
                    onClick={() => setInboxOpen(!inboxOpen)}
                    className={`relative hover:cursor-pointer rounded-full p-2 box-border ${
                      inboxOpen ? "bg-gray-200" : ""
                    }`}
                  >
                    <Bell className="w-6 h-6 text-gray-600" />
                  </button>
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
      </div>
    </nav>
  );
};

export default Navbar;
