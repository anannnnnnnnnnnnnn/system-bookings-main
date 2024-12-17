'use client'
import React from 'react';
import Navbar from '../component/navbar';
import Sidebar from '../component/sidebar';
import Navigation from '../component/navigation';
import { Layout } from 'antd';

const { Content } = Layout;

function Page() {
    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Navbar />
            <Layout style={{ padding: '0px 50px', marginTop: '50px', backgroundColor: '#fff' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px', backgroundColor: '#fff' }}>
                    <Navigation />
                    <Content
                        style={{
                            marginTop: '21px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Page;
