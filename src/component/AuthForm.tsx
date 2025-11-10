"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Form, Typography, Spin, message, Alert } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModalConfirmation from "@/component/ModalConfirmation";

const { Title, Text } = Typography;

interface AuthFormProps {
  type: "login" | "register";
}
interface FormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { name, email, password, confirmPassword } = values;

      if (type === "register" && password !== confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      const endpoint =
        type === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        type === "register"
          ? { name, email, password, confirmPassword }
          : { email, password };

      const res = await axios.post(endpoint, payload);

      if (type === "login") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/");
      } else {
        setModalText("Registration successful! You can now log in.");
        setIsModalOpen(true);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (type === "login" && err.response?.status === 401) {
          setErrorMsg("Please input correct email or password");
        } else {
          setErrorMsg(err?.response?.data?.error || "Something went wrong");
        }
      } else {
        setErrorMsg("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: "url(/pokemon-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Title level={3}>Pokemon Dashboard</Title>
            <Text type="secondary">
              {type === "login"
                ? "Welcome to Pokemon Dashboard"
                : "Create your Pokemon Dashboard account"}
            </Text>
          </div>
          {errorMsg && (
            <Alert message={errorMsg} type="error" className="mb-10" />
          )}

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {type === "register" && (
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
            )}

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email must contain @ and .com domain",
                },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {type === "register" && (
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password" },
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-700 hover:bg-blue-800"
                loading={loading}
              >
                {type === "login" ? "LOGIN" : "REGISTER"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              {type === "login" ? (
                <>
                  Haven’t registered yet?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login
                  </Link>
                </>
              )}
            </Text>
          </div>
        </div>

        <ModalConfirmation
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          loading={loading}
          text={modalText}
        />
      </div>
    );
  }
};

export default AuthForm;
