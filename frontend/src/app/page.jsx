'use client'

import React, { useState } from 'react'
import { Input, Button, Form, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (values) => {
    console.log('Logging in with:', values)
    // Handle login logic here
  }

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Welcome Back!</h2>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Link href="/users/home">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full rounded-lg"
              size="large"
            >
              Log In
            </Button>
            </Link>
          </Form.Item>

          <Divider />
        </Form>
      </div>
    </div>
  )
}

export default Login
