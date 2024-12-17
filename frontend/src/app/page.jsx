'use client'

import React, { useState } from 'react'
import { Input, Button, Form, Divider, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title } = Typography

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (values) => {
    console.log('Logging in with:', values)
    // Handle login logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-96">
        <Title level={2} className="text-center text-gray-800 mb-6">
          Welcome Back!
        </Title>

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
              size="large"
              autoComplete="email"
              style={{ borderRadius: '10px', padding: '10px' }}
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
              size="large"
              style={{ borderRadius: '10px', padding: '10px' }}
            />
          </Form.Item>

          <Form.Item>
            <Link href="/users/home">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full rounded-lg py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold"
                size="large"
              >
                Log In
              </Button>
            </Link>
          </Form.Item>

          <Divider />
          
          {/* Additional style for forgot password or signup link */}
          <div className="text-center text-sm text-gray-500">
            <Link href="/forgot-password" className="hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
