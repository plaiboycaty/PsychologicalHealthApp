import React from 'react';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, Row, Col, Drawer, Popconfirm } from 'antd';
import { Plus, Edit, Trash2, List, Copy } from 'lucide-react';
import { useTestManagement } from '../hooks/useTestManagement';

const { Title, Text } = Typography;

const QuestionManagement: React.FC = () => {
  const {
    // Tests
    tests, loadingTests, isTestModalOpen, openTestModal, closeTestModal, testForm, handleSaveTest, handleDeleteTest, editingTest,
    // Drawer
    isDrawerOpen, openQuestionDrawer, closeQuestionDrawer, selectedTestId,
    // Questions
    questions, loadingQuestions, isQuestionModalOpen, openQuestionModal, closeQuestionModal, questionForm, handleSaveQuestion, handleDeleteQuestion, editingQuestion, handleCloneOptions
  } = useTestManagement();

  const testColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên bài Test', dataIndex: 'name', key: 'name', render: (text: string) => <span style={{ fontWeight: 700, color: '#4ABEB2' }}>{text}</span> },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right' as const,
      width: 250,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<List size={16} color="#4ABEB2" />}
            onClick={() => openQuestionDrawer(record.id)}
            style={{ display: 'flex', alignItems: 'center', backgroundColor: '#EEF8F7', borderRadius: 8 }}
          >
            Chi tiết
          </Button>
          <Button
            type="text"
            icon={<Edit size={16} color="#2F80ED" />}
            onClick={() => openTestModal(record)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF3FE', borderRadius: 8, width: 34, height: 34 }}
          />
          <Popconfirm title="Bạn có chắc chắn muốn xóa bài test này?" onConfirm={() => handleDeleteTest(record.id)}>
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F0', borderRadius: 8, width: 34, height: 34 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const questionColumns = [
    { title: 'Thứ tự', dataIndex: 'question_order', key: 'question_order', width: 80, align: 'center' as const },
    { title: 'Nội dung câu hỏi', dataIndex: 'content', key: 'content' },
    { title: 'Số lượng đáp án', dataIndex: 'options', key: 'options', render: (options: any[]) => options?.length || 0, width: 150, align: 'center' as const },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right' as const,
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<Edit size={16} color="#2F80ED" />} onClick={() => openQuestionModal(record)} />
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => handleDeleteQuestion(record.id)}>
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* HEADER TỔNG */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#2D2D2D', fontWeight: 800 }}>Quản lý Bộ câu hỏi</Title>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => openTestModal()} style={{ borderRadius: 10, height: 38, fontWeight: 600 }}>
          Thêm bộ câu hỏi
        </Button>
      </div>

      {/* BẢNG DANH SÁCH BÀI TEST */}
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0px 4px 20px rgba(0,0,0,0.04)' }}>
        <Table columns={testColumns} dataSource={tests} loading={loadingTests} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      {/* MODAL THÊM/SỬA BÀI TEST (METADATA) */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>{editingTest ? 'Sửa Bộ Câu Hỏi' : 'Thêm Bộ Câu Hỏi'}</span>}
        open={isTestModalOpen}
        onCancel={closeTestModal}
        onOk={handleSaveTest}
        confirmLoading={loadingTests}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={testForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item label="Tên bài test" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: DASS-21" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả mục đích bài test..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* DRAWER QUẢN LÝ CÂU HỎI CHI TIẾT */}
      <Drawer
        title={<span style={{ fontWeight: 700, fontSize: 18 }}>Chi tiết Câu hỏi</span>}
        placement="right"
        width={800}
        onClose={closeQuestionDrawer}
        open={isDrawerOpen}
        extra={
          <Button type="primary" icon={<Plus size={16} />} onClick={() => openQuestionModal()} style={{ borderRadius: 8 }}>
            Thêm câu hỏi
          </Button>
        }
      >
        <Table columns={questionColumns} dataSource={questions} loading={loadingQuestions} rowKey="id" pagination={false} />
      </Drawer>

      {/* MODAL THÊM/SỬA CÂU HỎI & ĐÁP ÁN */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 700 }}>{editingQuestion ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}</span>}
        open={isQuestionModalOpen}
        onCancel={closeQuestionModal}
        onOk={handleSaveQuestion}
        confirmLoading={loadingQuestions}
        width={700}
        okText="Lưu câu hỏi"
        cancelText="Hủy"
      >
        <Form form={questionForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Nội dung câu hỏi" name="content" rules={[{ required: true, message: 'Nhập nội dung!' }]}>
                <Input placeholder="Ví dụ: Tôi cảm thấy khó chịu..." />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Thứ tự" name="question_order">
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
            <Text strong>Danh sách các đáp án</Text>
            <Button type="dashed" icon={<Copy size={14} />} onClick={handleCloneOptions} size="small">
              Nhân bản đáp án từ câu trước
            </Button>
          </div>

          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'content']} rules={[{ required: true, message: 'Nhập đáp án' }]}>
                      <Input placeholder="Nội dung đáp án (vd: Không bao giờ)" style={{ width: 450 }} />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'score']} rules={[{ required: true, message: 'Nhập điểm' }]}>
                      <Input type="number" placeholder="Điểm (vd: 0)" style={{ width: 100 }} />
                    </Form.Item>
                    {fields.length > 2 && (
                      <Button danger type="text" icon={<Trash2 size={16} />} onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<Plus size={16} />}>
                    Thêm đáp án
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionManagement;
