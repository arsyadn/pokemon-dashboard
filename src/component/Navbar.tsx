"use client";

import React, { useEffect, useState } from "react";
import { Button, Drawer, Avatar, Dropdown, MenuProps, Badge } from "antd";
import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

interface NavbarProps {
  logout: () => void;
}
export type UserType = {
  name: string;
  role: string;
  email: string;
};

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );

  const router = useRouter();

  const isLaptop = useMediaQuery({ query: "(min-width: 768px)" });

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-3 py-2">
          <div className="flex items-center gap-3">
            <Avatar src={"/avatar.jpg"} size={40} icon={<UserOutlined />} />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "signout",
      label: (
        <div
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer px-3 py-2"
        >
          <LogoutOutlined />
          <span>Sign Out</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <h1 className="text-lg font-semibold text-gray-800">
          Pokemon Dashboard
        </h1>

        <div className="hidden md:flex items-center gap-5">
          <Badge>
            <BellOutlined className="text-xl text-gray-600 cursor-pointer hover:text-blue-500" />
          </Badge>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <div className="cursor-pointer">
              <Avatar
                src={"/avatar.jpg"}
                size="large"
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </div>

        {!isLaptop && (
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl" />}
            onClick={() => setOpen(true)}
            className="block md:hidden"
          />
        )}
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="mt-6 border-t pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={"/avatar.jpg"} size={40} icon={<UserOutlined />} />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button type="link" icon={<LogoutOutlined />} danger onClick={logout}>
            Sign Out
          </Button>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
