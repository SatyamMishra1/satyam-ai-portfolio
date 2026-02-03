"use client";
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Button, Input, Card, Tag, Space, Tooltip } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, FileExcelOutlined } from '@ant-design/icons';
import Lottie from "lottie-react";
import robotAnimation from '../public/animations/webdesign.json';
import { tags } from '@/Components/Common/constant';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Portfolio() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', content: "<p>Hey there! I'm the AI version of Satyam Mishra. I know everything about his work with <strong>Next, Node, React, Express, Zoho, N8N, and Strapi</strong>. Ask me anything about his work</p>" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const askAI = async () => {
    if (!input.trim() || isDisabled) return;
    setIsDisabled(true);
    const userMsg = { role: 'user', content: input };
    setInput('');
    setIsTyping(true);
    const updatedHistory = [...chat, userMsg];
    setChat(updatedHistory);
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, 
          history: updatedHistory }),
      });

      
      const data = await res.json();
      const aiResponse = data?.text;
      const emailRegex = /\[TRIGGER_EMAIL:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/i;
      const emailMatch = aiResponse?.match(emailRegex);

      let finalDisplayMessage = aiResponse;

      if (emailMatch) {
        const [fullTag, name, email, comment] = emailMatch;
        finalDisplayMessage = aiResponse?.replace(fullTag, "");

        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: name.trim(), 
            email: email.trim(), 
            comment: comment.trim() 
          }),
        }).then(response => {
          if(response.ok) console.log("Email sent successfully!");
          else console.error("Email API failed");
        }).catch(err => console.error("Network error on email call:", err));
      }
      const aiMsg = { role: 'ai', content: renderChatContent(aiResponse) };
      setChat(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setChat(prev => [...prev, { role: 'ai', content: "My circuits are fried. Try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderChatContent = (content) => {
    const renderer = new marked.Renderer();
    renderer.link = ({ href, title, text }) => {
      return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    };
  
    return marked.parse(content, { renderer });
  };

  const stripHtml = (html) => {
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    }
    return html;
  };

  const exportChatToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Chat History');

    worksheet.columns = [
      { header: 'Serial No', key: 'id', width: 10 },
      { header: 'Sender', key: 'sender', width: 15 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Timestamp', key: 'time', width: 25 },
    ];
  
    chat.forEach((msg, index) => {
      worksheet.addRow({
        id: index + 1,
        sender: msg.role === 'ai' ? 'Satyam AI' : 'User',
        message: stripHtml(msg.content),
        time: new Date().toLocaleString(),
      });
    });
  
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDBEAFE' },
    };
  
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Satyam_Chat_Export_${new Date().getTime()}.xlsx`);
  };

  return (
    <main className="portfolio-wrapper">
      <section className="hero">
      <div className="profile-image-container">
      <img 
        src="/satyammishra.png" 
        alt="Satyam Mishra" 
        className="profile-circle"
      />
    </div>
        <h1>Hi, I'm Satyam Mishra <span className="wave">👋</span></h1>
        <p className="subtitle">Full-Stack Developer</p>
        <Space size="middle" className='tagsWrapper'>
        {tags?.map((tag, index) => (
      <Tag key={index} color={tag.color} style={{ flexShrink: 0 }}>
        {tag.name}
      </Tag>
    ))}
        </Space>
      </section>

      <section className="ai-chat-section">
        <Card title={<span><RobotOutlined /> Ask My AI</span>} className="chat-card"
        extra={chat?.length > 2 && (
          <Tooltip title="Export chat to Excel">
            <Button 
              type="text" 
              icon={<FileExcelOutlined style={{ color: '#1d6f42', fontSize: '18px' }} />} 
              onClick={exportChatToExcel}
            >
              Export
            </Button>
          </Tooltip>
        )}
        >
          <div className="chat-window">
            {chat?.length === 1 && robotAnimation && (
              <div className="lottie-container">
                <Lottie 
                  animationData={robotAnimation} 
                  loop={true} 
                  style={{ height: 100, width: 150 }} 
                />
              </div>
            )}
            {chat?.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className="avatar">
                  {msg?.role === 'ai' ? <RobotOutlined /> : <UserOutlined />}
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