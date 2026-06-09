import React, { useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, Row, Col } from 'antd';
import { Plus, Edit, Trash2 } from 'lucide-react';

const { Title } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Tên bài Test',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span style={{ fontWeight: 700, color: '#4ABEB2' }}>{text}</span>,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Số câu hỏi',
    dataIndex: 'questionCount',
    key: 'questionCount',
    align: 'center' as const,
  },
  {
    title: 'Hành động',
    key: 'action',
    align: 'right' as const,
    render: () => (
      <Space size="middle">
        <Button 
          type="text" 
          icon={<Edit size={16} color="#2F80ED" />} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF3FE', borderRadius: 8, width: 34, height: 34 }}
        />
        <Button 
          type="text" 
          danger 
          icon={<Trash2 size={16} />} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F0', borderRadius: 8, width: 34, height: 34 }}
        />
      </Space>
    ),
  },
];

const data = [
  {
    id: '1',
    name: 'DASS-21',
    description: 'Đánh giá mức độ Trầm cảm, Lo âu và Stress',
    questionCount: 21,
  },
  {
    id: '2',
    name: 'BECK',
    description: 'Thang đo đánh giá mức độ trầm cảm',
    questionCount: 21,
  },
];

const QuestionManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#2D2D2D', fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
          Quản lý Bộ câu hỏi
        </Title>
        <Button 
          type="primary" 
          icon={<Plus size={16} />} 
          style={{ borderRadius: 10, height: 38, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm bộ câu hỏi
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)' }}>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />
      </Card>

      <Modal
        title={
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: '"Nunito", sans-serif', color: '#2D2D2D' }}>
            Tạo Bộ Câu Hỏi Mới
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        okText="Lưu dữ liệu"
        cancelText="Hủy bỏ"
        okButtonProps={{ style: { borderRadius: 8, height: 38, fontWeight: 600 } }}
        cancelButtonProps={{ style: { borderRadius: 8, height: 38 } }}
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong style={{ color: '#434343' }}>Tên bài test</strong>} name="name" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Zung Test" style={{ borderRadius: 8, height: 38 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong style={{ color: '#434343' }}>Danh mục</strong>} name="category">
                <Input placeholder="Ví dụ: Lo âu" style={{ borderRadius: 8, height: 38 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<strong style={{ color: '#434343' }}>Mô tả</strong>} name="description">
            <Input.TextArea rows={3} placeholder="Mô tả mục đích của bài test..." style={{ borderRadius: 8 }} />
          </Form.Item>
          
          <div style={{ 
            background: '#EEF8F7', 
            padding: 20, 
            borderRadius: 12, 
            border: '1px dashed #B5E7E2',
            textAlign: 'center',
            color: '#4ABEB2',
            fontWeight: 600,
            fontFamily: '"Nunito", sans-serif',
            marginTop: 10
          }}>
            Khu vực sử dụng Form.List của Ant Design để thêm linh hoạt các câu hỏi và đáp án sẽ được thiết kế ở đây.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionManagement;
