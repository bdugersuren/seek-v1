"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { setAccessToken } from "@/lib/auth-client";
import {
  enrichUserWithMockRole,
  readMockSession,
} from "@/features/auth/mock-users";
import { Spinner } from "@seek/ui";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false";

        if (enableMock) {
          const mockUser = readMockSession();

          if (mockUser) {
            dispatch(loginSuccess(mockUser));
            return;
          }
        }

        // Хөтөч ачаалагдах үед refresh токенийг ашиглан access токенийг сэргээнэ
        const res = await fetch("/api/v1/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);

          // Одоогийн хэрэглэгчийн мэдээллийг татна
          const userRes = await fetch("/api/v1/auth/me", {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            dispatch(loginSuccess(enrichUserWithMockRole(userData)));
          }
        }
      } catch (e) {
        dispatch(loginFailure("Failed to restore session"));
      } finally {
        setBootstrapped(true);
      }
    };

    bootstrapSession();
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
