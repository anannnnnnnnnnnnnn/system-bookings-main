'use client'
import React from 'react'
import Sidebar from './component/sidebar';
import Navbar from './component/navbar';
import { Layout } from 'antd'

const {Content} = Layout;

function Home() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout style={{ padding: "0px 20px", marginTop: "20px" }}>
        <Sidebar />
        <Layout style={{ padding: "0px 20px" }}>
          <Content
            style={{
              padding: "24px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <h1>HELLO</h1>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Home