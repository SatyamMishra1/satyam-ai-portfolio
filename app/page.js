"use client";
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Button, Input, Card, Tag, Space } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import Lottie from "lottie-react";
import robotAnimation from '../public/animations/webdesign.json';

export default function Portfolio() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', content: "<p>Hey there! I'm the AI version of Satyam Mishra. I know everything about his work with <strong>Next, Node, React, Express, Zoho, N8N, and Strapi</strong>. Ask me anything, or just tell me a joke.</p>" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const chatEndRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // useEffect(() => {
  //   fetch("https://lottie.host/7c9a416a-a28a-4d7a-8f9d-5f33f38d3886/1p2S3A5V2j.json")
  //     .then((res) => res.json())
  //     .then((data) => setAnimationData(data))
  //     .catch((err) => console.error("Lottie failed to brew:", err));
  // }, []);

  const askAI = async () => {
    if (!input.trim() || isDisabled) return;

    setIsDisabled(true);
    const userMsg = { role: 'user', content: input };
    setChat(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();
      const aiMsg = { role: 'ai', content: marked.parse(data.text) };
      setChat(prev => [...prev, aiMsg]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', content: "My circuits are fried. Try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="portfolio-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero">
        <h1>Hi, I'm Satyam Mishra <span className="wave">👋</span></h1>
        <p className="subtitle">Full-Stack Developer</p>
        <Space size="middle">
          <Tag color="blue">Next.js</Tag>
          <Tag color="violet">React.js</Tag>
          <Tag color="green">Node.js</Tag>
          <Tag color="red">React native</Tag>
          <Tag color="yellow">Express.js</Tag>
          <Tag color="orange">N8N</Tag>
          <Tag color="green">Zoho</Tag>
          <Tag color="purple">Strapi</Tag>
        </Space>
      </section>

      <section className="ai-chat-section">
        <Card title={<span><RobotOutlined /> Ask My AI</span>} className="chat-card">
          <div className="chat-window">
            {/* LOTTIE ANIMATION: Only shows when only the welcome message exists */}
            {chat.length === 1 && robotAnimation && (
              <div className="lottie-container">
                <Lottie 
                  animationData={robotAnimation} 
                  loop={true} 
                  style={{ height: 100, width: 150 }} 
                />
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className="avatar">
                  {msg.role === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                </div>
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: msg.content }} 
                />
              </div>
            ))}
            {isTyping && <div className="typing">AI is thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          
          <div className="input-area">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={askAI}
              placeholder={"Ask anything about me"}
              suffix={<Button type="primary" icon={<SendOutlined />} disabled={isDisabled} onClick={askAI} />}
            />
          </div>
        </Card>
      </section>

      {/* <section className="projects">
        <h2>Selected Works</h2>
        <div className="project-grid">
          <Card hoverable title="N8N Automation Engine" className="p-card">
            <p>Automated a complex Zoho CRM workflow for a fintech client.</p>
          </Card>
        </div>
      </section> */}
    </main>
  );
}