import React from 'react';
import { Row, Col, Card, Typography, Form, Select, DatePicker, Button, Table } from 'antd';
import { Printer, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReport } from '../hooks/useReport';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Report: React.FC = () => {
  const {
    form,
    loading,
    reportData,
    dateRangeStr,
    printRef,
    handleGenerateReport,
    handleExportPDF,
    handlePrint
  } = useReport();

  // Cấu hình bảng hoạt động trong báo cáo
  const tableColumns = [
    { title: 'CHỈ SỐ', dataIndex: 'metric', key: 'metric', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'GIÁ TRỊ', dataIndex: 'value', key: 'value', align: 'right' as const, render: (val: number) => <Text strong>{val}</Text> }
  ];

  const tableData = reportData ? [
    { key: '1', metric: 'Người dùng đăng ký mới', value: reportData.new_users },
    { key: '2', metric: 'Bài test thực hiện mới', value: reportData.new_tests },
    { key: '3', metric: 'Tổng số người dùng toàn thời gian', value: reportData.all_time_users },
    { key: '4', metric: 'Tổng số bài test toàn thời gian', value: reportData.all_time_tests }
  ] : [];

  return (
    <>
      {/* CSS dành riêng cho Print mode */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
          }
        }
      `}</style>

      <Row gutter={[24, 24]} style={{ margin: 0, padding: 0 }}>
        {/* Cột trái: Điều khiển (Form) */}
        <Col xs={24} lg={7}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0px 4px 20px rgba(0,0,0,0.04)' }}>
            <Title level={4} style={{ marginBottom: 24, marginTop: 0 }}>Chọn cấu hình báo cáo</Title>
            <Form form={form} layout="vertical" onFinish={handleGenerateReport}>
              <Form.Item label="Loại báo cáo" name="type" initialValue="system">
                <Select
                  options={[{ value: 'system', label: 'Báo cáo hệ thống' }]}
                />
              </Form.Item>
              
              <Form.Item 
                label="Thời gian cụ thể" 
                name="dates"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<FileText size={16} />}
                  style={{ width: '100%', height: 40, borderRadius: 8 }}
                >
                  Tạo báo cáo
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Cột phải: Khung xem trước A4 */}
        <Col xs={24} lg={17}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Xem trước báo cáo</Title>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button icon={<Download size={16} />} onClick={handleExportPDF}>
                Xuất PDF
              </Button>
              <Button icon={<Printer size={16} />} onClick={handlePrint}>
                In báo cáo
              </Button>
            </div>
          </div>

          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 8, 
              boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
              padding: 0,
              minHeight: 800,
              overflow: 'hidden'
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Vùng cần In/Chụp ảnh PDF */}
            <div id="print-area" ref={printRef} style={{ padding: '40px 48px', background: '#FFF' }}>
              {/* Header Báo cáo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0F2F5', paddingBottom: 20, marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src="/icon.png" alt="logo" style={{ width: 48, height: 48, borderRadius: 8 }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#2D2D2D' }}>HỆ THỐNG TRỊ LIỆU TÂM LÝ 52HZ</h2>
                    <span style={{ fontSize: 13, color: '#8C8C8C' }}>52Hz Admin Management System</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#8C8C8C' }}>Ngày xuất: {dayjs().format('DD/MM/YYYY')}</div>
                </div>
              </div>

              {reportData ? (
                <>
                  {/* Tiêu đề Báo cáo */}
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2} style={{ margin: 0, letterSpacing: '1px', color: '#1A237E' }}>BÁO CÁO HỆ THỐNG</Title>
                    <Text style={{ color: '#595959' }}>Thời gian: {dateRangeStr}</Text>
                  </div>

                  {/* Tổng quan (4 hộp) */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
                    <Col span={6}>
                      <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <Title level={3} style={{ margin: 0, color: '#4ABEB2' }}>{reportData.new_users}</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Người dùng mới</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <Title level={3} style={{ margin: 0, color: '#4ABEB2' }}>{reportData.new_tests}</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Lượt làm test mới</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <Title level={3} style={{ margin: 0, color: '#2D2D2D' }}>{reportData.all_time_users}</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Tổng Users</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                        <Title level={3} style={{ margin: 0, color: '#2D2D2D' }}>{reportData.all_time_tests}</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Tổng Lượt test</Text>
                      </div>
                    </Col>
                  </Row>

                  {/* Bảng dữ liệu và Biểu đồ */}
                  <Row gutter={32}>
                    <Col span={12}>
                      <Title level={5}>Thống kê hoạt động</Title>
                      <Table 
                        columns={tableColumns} 
                        dataSource={tableData} 
                        pagination={false} 
                        size="small"
                        bordered
                      />
                    </Col>
                    <Col span={12}>
                      <Title level={5}>Biểu đồ người dùng mới theo ngày</Title>
                      <div style={{ height: 250, border: '1px solid #EAEAEA', borderRadius: 8, padding: '16px 16px 0 0' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={reportData.user_chart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(val) => dayjs(val).format('DD/MM')} />
                            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                            <Tooltip labelFormatter={(val) => dayjs(val).format('DD/MM/YYYY')} />
                            <Bar dataKey="count" fill="#4ABEB2" isAnimationActive={false} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <div style={{ height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#BFBFBF' }}>
                  <FileText size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                  <span style={{ fontSize: 16 }}>Vui lòng chọn thời gian và bấm "Tạo báo cáo" để xem trước dữ liệu</span>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Report;
